<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TeamController extends Controller
{
    public function index()
    {
        $members = TeamMember::orderBy('order')->orderBy('created_at', 'desc')->paginate(20);
        return Inertia::render('Admin/Team', [
            'members' => $members,
            'admin'   => Auth::guard('admin')->user(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'          => 'required|string|max:255',
            'role'          => 'required|string|max:255',
            'bio'           => 'nullable|string',
            'twitter_url'   => 'nullable|string',
            'instagram_url' => 'nullable|string',
            'linkedin_url'  => 'nullable|string',
            'youtube_url'   => 'nullable|string',
            'is_active'     => 'nullable|boolean',
            'order'         => 'nullable|integer',
            'photo'         => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('team', 'public');
        }

        $data['is_active'] = $request->boolean('is_active', true);

        TeamMember::create($data);
        return back()->with('success', 'Team member added!');
    }

    public function update(Request $request, TeamMember $team)
    {
        $data = $request->validate([
            'name'          => 'required|string|max:255',
            'role'          => 'required|string|max:255',
            'bio'           => 'nullable|string',
            'twitter_url'   => 'nullable|string',
            'instagram_url' => 'nullable|string',
            'linkedin_url'  => 'nullable|string',
            'youtube_url'   => 'nullable|string',
            'is_active'     => 'nullable|boolean',
            'order'         => 'nullable|integer',
            'photo'         => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            if ($team->photo) Storage::disk('public')->delete($team->photo);
            $data['photo'] = $request->file('photo')->store('team', 'public');
        }

        $data['is_active'] = $request->boolean('is_active', true);

        $team->update($data);
        return back()->with('success', 'Team member updated!');
    }

    public function destroy(TeamMember $team)
    {
        if ($team->photo) Storage::disk('public')->delete($team->photo);
        $team->delete();
        return back()->with('success', 'Team member deleted!');
    }
}