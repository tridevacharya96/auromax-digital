<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with(['order.user']);

        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->gateway) {
            $query->where('gateway', $request->gateway);
        }
        if ($request->from) {
            $query->whereDate('created_at', '>=', $request->from);
        }
        if ($request->to) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        $payments = $query->latest()->paginate(15);

        $totalSuccess  = Payment::where('status', 'success')->sum('amount');
        $totalPending  = Payment::where('status', 'pending')->sum('amount');
        $totalFailed   = Payment::where('status', 'failed')->sum('amount');
        $totalRefunded = Payment::where('status', 'refunded')->sum('amount');

        return Inertia::render('Admin/Payments', [
            'payments' => $payments,
            'filters'  => $request->only(['status', 'gateway', 'from', 'to']),
            'totals'   => compact('totalSuccess', 'totalPending', 'totalFailed', 'totalRefunded'),
            'admin'    => Auth::guard('admin')->user(),
        ]);
    }
}
