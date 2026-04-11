<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CmsContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CmsController extends Controller
{
    public function index()
    {
        $cms = CmsContent::all()->groupBy('section')->map(fn($items) =>
            $items->pluck('value', 'key')
        );

        return Inertia::render('Admin/Cms', [
            'cms'   => $cms,
            'admin' => Auth::guard('admin')->user(),
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'section' => 'required|string',
            'key'     => 'required|string',
            'value'   => 'nullable|string',
        ]);

        CmsContent::updateOrCreate(
            ['section' => $data['section'], 'key' => $data['key']],
            ['value'   => $data['value']]
        );

        return back()->with('success', 'Content updated successfully!');
    }
}
