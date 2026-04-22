<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use App\Models\Video;
use App\Models\Celebrity;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index()
    {
        $thisYear  = now()->year;
        $lastYear  = now()->year - 1;
        $thisMonth = now()->month;

        // Monthly revenue this year vs last year
        $monthlyThis = Payment::where('status', 'success')
            ->whereRaw("strftime('%Y',created_at) = ?", [$thisYear])
            ->select(DB::raw("CAST(strftime('%m',created_at) AS INTEGER) as month"), DB::raw('SUM(amount) as total'))
            ->groupBy('month')->orderBy('month')->get()->keyBy('month');

        $monthlyLast = Payment::where('status', 'success')
            ->whereRaw("strftime('%Y',created_at) = ?", [$lastYear])
            ->select(DB::raw("CAST(strftime('%m',created_at) AS INTEGER) as month"), DB::raw('SUM(amount) as total'))
            ->groupBy('month')->orderBy('month')->get()->keyBy('month');

        $revenueChart = collect(range(1, 12))->map(fn($m) => [
            'month'    => date('M', mktime(0,0,0,$m,1)),
            'thisYear' => $monthlyThis[$m]->total ?? 0,
            'lastYear' => $monthlyLast[$m]->total ?? 0,
        ]);

        // Daily revenue last 30 days
        $dailyRevenue = Payment::where('status', 'success')
            ->whereRaw("created_at >= date('now','-30 days')")
            ->select(DB::raw("date(created_at) as date"), DB::raw('SUM(amount) as total'))
            ->groupBy('date')->orderBy('date')->get();

        // Orders by status
        $ordersByStatus = Order::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')->get()->pluck('count', 'status');

        // Top products
        $topProducts = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->select('products.name', 'products.type', DB::raw('SUM(order_items.quantity) as total_qty'), DB::raw('SUM(order_items.total) as total_revenue'))
            ->groupBy('products.id', 'products.name', 'products.type')
            ->orderByDesc('total_revenue')
            ->limit(5)->get();

        // Customer growth last 12 months
        $customerGrowth = User::whereRaw("created_at >= date('now','-12 months')")
            ->select(DB::raw("strftime('%Y-%m', created_at) as month"), DB::raw('COUNT(*) as count'))
            ->groupBy('month')->orderBy('month')->get();

        // Payment methods breakdown
        $paymentMethods = Payment::where('status', 'success')
            ->select('gateway', DB::raw('COUNT(*) as count'), DB::raw('SUM(amount) as total'))
            ->groupBy('gateway')->get();

        // Key metrics
        $totalRevenue      = Payment::where('status', 'success')->sum('amount');
        $totalOrders       = Order::count();
        $totalCustomers    = User::count();
        $avgOrderValue     = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;
        $conversionRate    = $totalCustomers > 0 ? round(($totalOrders / $totalCustomers) * 100, 1) : 0;
        $thisMonthRevenue  = Payment::where('status', 'success')->whereRaw("strftime('%m',created_at) = ?", [str_pad($thisMonth, 2, '0', STR_PAD_LEFT)])->whereRaw("strftime('%Y',created_at) = ?", [$thisYear])->sum('amount');
        $lastMonthRevenue  = Payment::where('status', 'success')->whereRaw("strftime('%m',created_at) = ?", [str_pad($thisMonth - 1, 2, '0', STR_PAD_LEFT)])->whereRaw("strftime('%Y',created_at) = ?", [$thisYear])->sum('amount');
        $revenueGrowth     = $lastMonthRevenue > 0 ? round((($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1) : 0;

        return Inertia::render('Admin/Analytics', [
            'admin'          => Auth::guard('admin')->user(),
            'revenueChart'   => $revenueChart,
            'dailyRevenue'   => $dailyRevenue,
            'ordersByStatus' => $ordersByStatus,
            'topProducts'    => $topProducts,
            'customerGrowth' => $customerGrowth,
            'paymentMethods' => $paymentMethods,
            'metrics'        => compact(
                'totalRevenue', 'totalOrders', 'totalCustomers',
                'avgOrderValue', 'conversionRate', 'thisMonthRevenue',
                'lastMonthRevenue', 'revenueGrowth'
            ),
        ]);
    }
}
