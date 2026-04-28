<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class VideoController extends Controller
{
    public function index()
    {
        $videos = Video::orderBy('order')->orderBy('created_at', 'desc')->paginate(20);
        return Inertia::render('Admin/Videos', [
            'videos'         => $videos,
            'admin'          => Auth::guard('admin')->user(),
            'youtube_config' => [
                'has_api_key'    => !empty(config('services.youtube.api_key')),
                'has_channel_id' => !empty(config('services.youtube.channel_id')),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'youtube_url' => 'required|string',
            'category'    => 'nullable|string|max:100',
            'order'       => 'nullable|integer',
            'is_active'   => 'boolean',
        ]);

        $data['youtube_id'] = Video::extractYoutubeId($data['youtube_url']);
        $data['source']     = 'manual';

        if (empty($data['youtube_id'])) {
            return back()->withErrors(['youtube_url' => 'Invalid YouTube URL.']);
        }

        // Auto-detect category if not manually set
        if (empty($data['category'])) {
            $data['category'] = $this->detectCategory(
                $data['youtube_id'],
                $data['title'] ?? '',
                $data['description'] ?? ''
            );
        }

        Video::create($data);
        return back()->with('success', 'Video added successfully!');
    }

    public function update(Request $request, Video $video)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'youtube_url' => 'required|string',
            'category'    => 'nullable|string|max:100',
            'order'       => 'nullable|integer',
            'is_active'   => 'boolean',
        ]);

        $data['youtube_id'] = Video::extractYoutubeId($data['youtube_url']);
        $video->update($data);
        return back()->with('success', 'Video updated!');
    }

    public function destroy(Video $video)
    {
        $video->delete();
        return back()->with('success', 'Video deleted!');
    }

    // Detect category using hashtags + duration
    private function detectCategory(string $videoId, string $title = '', string $description = ''): string
    {
        // Check hashtags first — most reliable signal
        $text = strtolower($title . ' ' . $description);
        if (str_contains($text, '#shorts') || str_contains($text, '#short')) {
            return 'shorts';
        }

        // Fallback: check duration via API
        try {
            $res = Http::get('https://www.googleapis.com/youtube/v3/videos', [
                'key'  => config('services.youtube.api_key'),
                'id'   => $videoId,
                'part' => 'contentDetails',
            ]);

            if ($res->successful()) {
                $seconds = $this->parseDuration(
                    $res->json('items.0.contentDetails.duration') ?? 'PT0S'
                );
                return $seconds <= 180 ? 'shorts' : 'podcast';
            }
        } catch (\Exception $e) {
            Log::error('Category detection failed: ' . $e->getMessage());
        }

        return 'podcast';
    }

    // Convert ISO 8601 duration (e.g. PT1M30S) to total seconds
    private function parseDuration(string $duration): int
    {
        preg_match('/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/', $duration, $m);
        return (int)($m[1] ?? 0) * 3600
             + (int)($m[2] ?? 0) * 60
             + (int)($m[3] ?? 0);
    }

    // Sync latest videos from YouTube channel
    public function syncYoutube()
    {
        $apiKey    = config('services.youtube.api_key');
        $channelId = config('services.youtube.channel_id');

        if (!$apiKey || !$channelId) {
            return back()->withErrors(['sync' => 'YouTube API key or Channel ID not configured in .env']);
        }

        try {
            // Step 1: Fetch latest 50 videos from channel
            $searchRes = Http::get('https://www.googleapis.com/youtube/v3/search', [
                'key'        => $apiKey,
                'channelId'  => $channelId,
                'part'       => 'snippet',
                'order'      => 'date',
                'type'       => 'video',
                'maxResults' => 50,
            ]);

            if (!$searchRes->successful()) {
                return back()->withErrors(['sync' => 'YouTube API error: ' . $searchRes->body()]);
            }

            $items = $searchRes->json('items', []);

            if (empty($items)) {
                return back()->withErrors(['sync' => 'No videos found on this channel.']);
            }

            // Step 2: Fetch durations for all videos in one API call
            $videoIds = collect($items)
                ->pluck('id.videoId')
                ->filter()
                ->implode(',');

            $detailsRes = Http::get('https://www.googleapis.com/youtube/v3/videos', [
                'key'  => $apiKey,
                'id'   => $videoIds,
                'part' => 'contentDetails',
            ]);

            // Build videoId => seconds map
            $durations = [];
            if ($detailsRes->successful()) {
                foreach ($detailsRes->json('items', []) as $detail) {
                    $durations[$detail['id']] = $this->parseDuration(
                        $detail['contentDetails']['duration'] ?? 'PT0S'
                    );
                }
            }

            $added   = 0;
            $skipped = 0;

            foreach ($items as $item) {
                $videoId = $item['id']['videoId'] ?? null;
                if (!$videoId) continue;

                // Skip already existing videos
                if (Video::where('youtube_id', $videoId)->exists()) {
                    $skipped++;
                    continue;
                }

                $snippet     = $item['snippet'];
                $title       = $snippet['title'] ?? '';
                $description = $snippet['description'] ?? '';
                $seconds     = $durations[$videoId] ?? 999;

                // Detect by hashtag first, then by duration (≤3 min = shorts)
                $text     = strtolower($title . ' ' . $description);
                $category = (str_contains($text, '#shorts') || str_contains($text, '#short') || $seconds <= 180)
                    ? 'shorts'
                    : 'podcast';

                Video::create([
                    'title'                => $title,
                    'description'          => $description,
                    'youtube_url'          => "https://www.youtube.com/watch?v={$videoId}",
                    'youtube_id'           => $videoId,
                    'category'             => $category,
                    'order'                => 0,
                    'is_active'            => true,
                    'source'               => 'youtube',
                    'youtube_published_at' => $snippet['publishedAt'] ?? null,
                ]);

                $added++;
            }

            return back()->with('success', "Sync complete! Added {$added} new videos ({$skipped} already existed). Shorts auto-detected! ⚡");

        } catch (\Exception $e) {
            Log::error('YouTube sync failed: ' . $e->getMessage());
            return back()->withErrors(['sync' => 'Sync failed: ' . $e->getMessage()]);
        }
    }
}