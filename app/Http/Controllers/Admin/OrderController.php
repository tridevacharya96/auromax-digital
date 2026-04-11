<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Delivery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['user', 'items.product', 'payment', 'delivery']);

        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->search) {
            $query->where('order_number', 'like', "%{$request->search}%")
                  ->orWhereHas('user', fn($q) => $q->where('name', 'like', "%{$request->search}%"));
        }

        $orders = $query->latest()->paginate(15);

        return Inertia::render('Admin/Orders', [
            'orders'  => $orders,
            'filters' => $request->only(['status', 'search']),
            'admin'   => Auth::guard('admin')->user(),
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $order->update(['status' => $request->status]);

        // Update delivery status too
        if ($order->delivery) {
            $map = [
                'processing' => 'packed',
                'shipped'    => 'shipped',
                'delivered'  => 'delivered',
                'cancelled'  => 'returned',
            ];
            if (isset($map[$request->status])) {
                $order->delivery->update(['status' => $map[$request->status]]);
            }
        }

        return back()->with('success', 'Order status updated!');
    }
}
