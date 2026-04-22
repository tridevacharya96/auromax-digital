<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');
        return Inertia::render('Admin/Settings', [
            'settings' => $settings,
            'admin'    => Auth::guard('admin')->user(),
        ]);
    }

    public function theme()
    {
        $settings = Setting::all()->pluck('value', 'key');
        return Inertia::render('Admin/Theme', [
            'settings' => $settings,
            'admin'    => Auth::guard('admin')->user(),
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate(['settings' => 'required|array']);
        foreach ($data['settings'] as $key => $value) {
            $group = str_starts_with($key, 'theme_') || str_starts_with($key, 'admin_') ? 'theme' : 'general';
            Setting::updateOrCreate(['key' => $key], ['value' => $value, 'group' => $group]);
        }
        return back()->with('success', 'Settings saved successfully!');
    }
}
