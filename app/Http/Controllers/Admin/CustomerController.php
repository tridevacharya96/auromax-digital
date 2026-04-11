<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = User::withCount('orders');

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
        }

        $customers = $query->latest()->paginate(15);

        return Inertia::render('Admin/Customers', [
            'customers' => $customers,
            'filters'   => $request->only(['search']),
            'admin'     => Auth::guard('admin')->user(),
        ]);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return back()->with('success', 'Customer deleted successfully!');
    }
}
