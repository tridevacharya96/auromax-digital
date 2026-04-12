<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $orders = Order::with(['items.product', 'delivery', 'payment'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        $totalSpent    = Payment::where('user_id', $user->id)->where('status', 'success')->sum('amount');
        $totalOrders   = $orders->count();
        $pendingOrders = $orders->where('status', 'pending')->count();
        $delivered     = $orders->where('status', 'delivered')->count();

        return Inertia::render('Profile', [
            'user'   => $user,
            'orders' => $orders,
            'stats'  => compact('totalSpent', 'totalOrders', 'pendingOrders', 'delivered'),
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'name'    => 'required|string|max:255',
            'phone'   => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'city'    => 'nullable|string|max:100',
            'state'   => 'nullable|string|max:100',
            'pincode' => 'nullable|string|max:10',
            'country' => 'nullable|string|max:100',
            'avatar'  => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('avatar')) {
            if ($user->avatar) Storage::disk('public')->delete($user->avatar);
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user->update($data);
        return back()->with('success', 'Profile updated successfully!');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password'         => 'required|min:8|confirmed',
        ]);

        if (!Hash::check($request->current_password, Auth::user()->password)) {
            return back()->withErrors(['current_password' => 'Current password is incorrect.']);
        }

        Auth::user()->update(['password' => Hash::make($request->password)]);
        return back()->with('success', 'Password changed successfully!');
    }
}
