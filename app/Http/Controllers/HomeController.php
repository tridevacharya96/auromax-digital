<?php

namespace App\Http\Controllers;

use App\Models\Celebrity;
use App\Models\CmsContent;
use App\Models\Product;
use App\Models\Setting;
use App\Models\Video;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $cms   = CmsContent::all()->groupBy('section')->map(fn($items) => $items->pluck('value', 'key'));
        $theme = Setting::where('group', 'theme')->get()->pluck('value', 'key');

        $bestsellers = Product::where('is_active', true)->where('is_featured', true)->limit(12)->get();
        $products    = Product::where('is_active', true)->latest()->limit(8)->get();

        $videos = Video::where('is_active', true)->orderBy('order')->orderBy('created_at', 'desc')->limit(12)->get()->map(fn($v) => [
            'id' => $v->id, 'title' => $v->title, 'description' => $v->description,
            'youtube_id' => $v->youtube_id, 'youtube_url' => $v->youtube_url,
            'thumbnail' => $v->thumbnail_url, 'category' => $v->category,
        ]);

        $celebrities = Celebrity::where('is_active', true)->orderBy('order')->limit(12)->get()->map(fn($c) => [
            'id' => $c->id, 'name' => $c->name, 'profession' => $c->profession,
            'bio' => $c->bio, 'photo' => $c->photo ? asset('storage/' . $c->photo) : null,
            'spotify_url' => $c->spotify_url, 'instagram_url' => $c->instagram_url,
            'youtube_url' => $c->youtube_url, 'is_featured' => $c->is_featured,
        ]);

        $auth = ['user' => auth()->user()];

        return Inertia::render('Home', compact(
            'cms', 'theme', 'bestsellers', 'products', 'videos', 'celebrities', 'auth'
        ));
    }
}
