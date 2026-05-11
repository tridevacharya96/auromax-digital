<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CelebrityWishBooking;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products  = Product::latest()->paginate(15);
        $bookings  = CelebrityWishBooking::with('product')->latest()->limit(20)->get();
        return Inertia::render('Admin/Products', [
            'products' => $products,
            'bookings' => $bookings,
            'admin'    => Auth::guard('admin')->user(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'               => 'required|string|max:255',
            'description'        => 'nullable|string',
            'type'               => 'required|in:digital,physical',
            'price'              => 'required|numeric|min:0',
            'sale_price'         => 'nullable|numeric|min:0',
            'stock'              => 'nullable|integer|min:0',
            'category'           => 'nullable|string|max:100',
            'is_active'          => 'nullable|boolean',
            'is_featured'        => 'nullable|boolean',
            'is_celebrity_wish'  => 'nullable|boolean',
            'celebrity_name'     => 'nullable|string|max:255',
            'delivery_days'      => 'nullable|integer|min:1',
            'sample_videos'      => 'nullable|string', // JSON string of youtube IDs
            'image'              => 'nullable|image|mimes:jpeg,png,jpg,webp|max:3072',
            'celebrity_photo'    => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }
        if ($request->hasFile('celebrity_photo')) {
            $data['celebrity_photo'] = $request->file('celebrity_photo')->store('celebrity-wishes', 'public');
        }

        $data['slug']              = Str::slug($data['name']) . '-' . Str::random(5);
        $data['is_active']         = $request->boolean('is_active', true);
        $data['is_featured']       = $request->boolean('is_featured');
        $data['is_celebrity_wish'] = $request->boolean('is_celebrity_wish');
        $data['sample_videos']     = $request->sample_videos ? json_decode($request->sample_videos, true) : [];

        Product::create($data);
        return back()->with('success', 'Product created successfully!');
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name'               => 'required|string|max:255',
            'description'        => 'nullable|string',
            'type'               => 'required|in:digital,physical',
            'price'              => 'required|numeric|min:0',
            'sale_price'         => 'nullable|numeric|min:0',
            'stock'              => 'nullable|integer|min:0',
            'category'           => 'nullable|string|max:100',
            'is_active'          => 'nullable|boolean',
            'is_featured'        => 'nullable|boolean',
            'is_celebrity_wish'  => 'nullable|boolean',
            'celebrity_name'     => 'nullable|string|max:255',
            'delivery_days'      => 'nullable|integer|min:1',
            'sample_videos'      => 'nullable|string',
            'image'              => 'nullable|image|mimes:jpeg,png,jpg,webp|max:3072',
            'celebrity_photo'    => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($product->image) Storage::disk('public')->delete($product->image);
            $data['image'] = $request->file('image')->store('products', 'public');
        }
        if ($request->hasFile('celebrity_photo')) {
            if ($product->celebrity_photo) Storage::disk('public')->delete($product->celebrity_photo);
            $data['celebrity_photo'] = $request->file('celebrity_photo')->store('celebrity-wishes', 'public');
        }

        $data['is_active']         = $request->boolean('is_active', true);
        $data['is_featured']       = $request->boolean('is_featured');
        $data['is_celebrity_wish'] = $request->boolean('is_celebrity_wish');
        $data['sample_videos']     = $request->sample_videos ? json_decode($request->sample_videos, true) : ($product->sample_videos ?? []);

        $product->update($data);
        return back()->with('success', 'Product updated!');
    }

    public function destroy(Product $product)
    {
        if ($product->image) Storage::disk('public')->delete($product->image);
        if ($product->celebrity_photo) Storage::disk('public')->delete($product->celebrity_photo);
        $product->delete();
        return back()->with('success', 'Product deleted!');
    }

    // Update booking fulfillment status
    public function updateBooking(Request $request, CelebrityWishBooking $booking)
    {
        $data = $request->validate([
            'fulfillment_status'  => 'required|in:pending,in_progress,completed',
            'delivered_video_url' => 'nullable|string',
        ]);
        $booking->update($data);
        return back()->with('success', 'Booking updated!');
    }
}