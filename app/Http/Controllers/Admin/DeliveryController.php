<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DeliveryController extends Controller
{
    public function index(Request $request)
    {
        $query = Delivery::with(['order.user']);

        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->search) {
            $query->where('tracking_number', 'like', "%{$request->search}%")
                ->orWhereHas('order.user', fn($q) => $q->where('name', 'like', "%{$request->search}%"));
        }

        $deliveries = $query->latest()->paginate(15);

        return Inertia::render('Admin/Deliveries', [
            'deliveries' => $deliveries,
            'filters'    => $request->only(['status', 'search']),
            'admin'      => Auth::guard('admin')->user(),
        ]);
    }

    public function update(Request $request, Delivery $delivery)
    {
        $request->validate([
            'status'           => 'required|in:pending,packed,shipped,out_for_delivery,delivered,returned',
            'tracking_number'  => 'nullable|string|max:100',
            'carrier'          => 'nullable|string|max:100',
            'estimated_delivery' => 'nullable|date',
        ]);

        $delivery->update($request->only(['status', 'tracking_number', 'carrier', 'estimated_delivery']));

        // Sync order status
        $map = [
            'packed'           => 'processing',
            'shipped'          => 'shipped',
            'out_for_delivery' => 'shipped',
            'delivered'        => 'delivered',
            'returned'         => 'cancelled',
        ];

        if (isset($map[$request->status])) {
            $delivery->order->update(['status' => $map[$request->status]]);
        }

        return back()->with('success', 'Delivery updated successfully!');
    }
}
