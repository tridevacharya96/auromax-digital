<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VideoController extends Controller
{
    public function index()
    {
        $videos = Video::orderBy('order')->orderBy('created_at', 'desc')->paginate(20);
        return Inertia::render('Admin/Videos', [
            'videos' => $videos,
            'admin'  => Auth::guard('admin')->user(),
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

        if (empty($data['youtube_id'])) {
            return back()->withErrors(['youtube_url' => 'Invalid YouTube URL. Please check and try again.']);
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
        return back()->with('success', 'Video updated successfully!');
    }

    public function destroy(Video $video)
    {
        $video->delete();
        return back()->with('success', 'Video deleted successfully!');
    }
}
