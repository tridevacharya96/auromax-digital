<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Celebrity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CelebrityController extends Controller
{
    public function index()
    {
        $celebrities = Celebrity::orderBy('order')->orderBy('created_at', 'desc')->paginate(20);
        return Inertia::render('Admin/Celebrities', [
            'celebrities' => $celebrities,
            'admin'       => Auth::guard('admin')->user(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'          => 'required|string|max:255',
            'profession'    => 'required|string|max:255',
            'bio'           => 'nullable|string',
            'spotify_url'   => 'nullable|string',
            'instagram_url' => 'nullable|string',
            'youtube_url'   => 'nullable|string',
            'is_featured'   => 'nullable|boolean',
            'is_active'     => 'nullable|boolean',
            'order'         => 'nullable|integer',
            'photo'         => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('celebrities', 'public');
        }

        $data['is_featured'] = $request->boolean('is_featured');
        $data['is_active']   = $request->boolean('is_active');

        Celebrity::create($data);
        return back()->with('success', 'Celebrity added successfully!');
    }

    public function update(Request $request, Celebrity $celebrity)
    {
        $data = $request->validate([
            'name'          => 'required|string|max:255',
            'profession'    => 'required|string|max:255',
            'bio'           => 'nullable|string',
            'spotify_url'   => 'nullable|string',
            'instagram_url' => 'nullable|string',
            'youtube_url'   => 'nullable|string',
            'is_featured'   => 'nullable|boolean',
            'is_active'     => 'nullable|boolean',
            'order'         => 'nullable|integer',
            'photo'         => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            if ($celebrity->photo) Storage::disk('public')->delete($celebrity->photo);
            $data['photo'] = $request->file('photo')->store('celebrities', 'public');
        }

        $data['is_featured'] = $request->boolean('is_featured');
        $data['is_active']   = $request->boolean('is_active');

        $celebrity->update($data);
        return back()->with('success', 'Celebrity updated successfully!');
    }

    public function destroy(Celebrity $celebrity)
    {
        if ($celebrity->photo) Storage::disk('public')->delete($celebrity->photo);
        $celebrity->delete();
        return back()->with('success', 'Celebrity deleted successfully!');
    }
}
