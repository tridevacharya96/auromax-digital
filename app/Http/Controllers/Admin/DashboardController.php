<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today    = now()->toDateString();
        $thisYear = now()->year;

        // Earnings
        $todayEarnings = Payment::where('status','success')->whereDate('created_at',$today)->sum('amount');
        $monthEarnings = Payment::where('status','success')->whereRaw("strftime('%m',created_at) = ?", [now()->format('m')])->whereRaw("strftime('%Y',created_at) = ?", [$thisYear])->sum('amount');
        $yearEarnings  = Payment::where('status','success')->whereRaw("strftime('%Y',created_at) = ?", [$thisYear])->sum('amount');
        $totalEarnings = Payment::where('status','success')->sum('amount');

        // Orders
        $totalOrders      = Order::count();
        $pendingOrders    = Order::where('status','pending')->count();
        $processingOrders = Order::where('status','processing')->count();
        $deliveredOrders  = Order::where('status','delivered')->count();
        $cancelledOrders  = Order::where('status','cancelled')->count();

        // Customers & Products
        $totalCustomers = User::count();
        $newCustomers   = User::whereRaw("strftime('%m',created_at) = ?", [now()->format('m')])->count();
        $totalProducts  = Product::count();
        $activeProducts = Product::where('is_active',true)->count();

        // Monthly chart using SQLite strftime
        $monthlyRaw = Payment::where('status','success')
            ->whereRaw("strftime('%Y',created_at) = ?", [$thisYear])
            ->select(DB::raw("CAST(strftime('%m',created_at) AS INTEGER) as month"), DB::raw('SUM(amount) as total'))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month');

        $chartData = collect(range(1,12))->map(fn($m) => [
            'month' => date('M', mktime(0,0,0,$m,1)),
            'total' => $monthlyRaw[$m]->total ?? 0,
        ]);

        // Recent orders
        $recentOrders = Order::with(['user','payment'])->latest()->limit(10)->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => compact(
                'todayEarnings','monthEarnings','yearEarnings','totalEarnings',
                'totalOrders','pendingOrders','processingOrders','deliveredOrders',
                'cancelledOrders','totalCustomers','newCustomers','totalProducts','activeProducts'
            ),
            'chartData'    => $chartData,
            'recentOrders' => $recentOrders,
            'admin'        => Auth::guard('admin')->user(),
        ]);
    }
}
