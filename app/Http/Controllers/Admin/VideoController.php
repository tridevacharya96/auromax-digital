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

    // Sync latest videos from YouTube channel
    public function syncYoutube()
    {
        $apiKey    = config('services.youtube.api_key');
        $channelId = config('services.youtube.channel_id');

        if (!$apiKey || !$channelId) {
            return back()->withErrors(['sync' => 'YouTube API key or Channel ID not configured in .env']);
        }

        try {
            $response = Http::get('https://www.googleapis.com/youtube/v3/search', [
                'key'        => $apiKey,
                'channelId'  => $channelId,
                'part'       => 'snippet',
                'order'      => 'date',
                'type'       => 'video',
                'maxResults' => 20,
            ]);

            if (!$response->successful()) {
                return back()->withErrors(['sync' => 'YouTube API error: ' . $response->body()]);
            }

            $items   = $response->json('items', []);
            $added   = 0;
            $skipped = 0;

            foreach ($items as $item) {
                $videoId = $item['id']['videoId'] ?? null;
                if (!$videoId) continue;

                // Skip if already exists
                if (Video::where('youtube_id', $videoId)->exists()) {
                    $skipped++;
                    continue;
                }

                $snippet = $item['snippet'];
                Video::create([
                    'title'                => $snippet['title'],
                    'description'          => $snippet['description'] ?? '',
                    'youtube_url'          => "https://www.youtube.com/watch?v={$videoId}",
                    'youtube_id'           => $videoId,
                    'category'             => 'podcast',
                    'order'                => 0,
                    'is_active'            => true,
                    'source'               => 'youtube',
                    'youtube_published_at' => $snippet['publishedAt'] ?? null,
                ]);
                $added++;
            }

            return back()->with('success', "Sync complete! Added {$added} new videos, skipped {$skipped} existing.");

        } catch (\Exception $e) {
            Log::error('YouTube sync failed: ' . $e->getMessage());
            return back()->withErrors(['sync' => 'Sync failed: ' . $e->getMessage()]);
        }
    }
}