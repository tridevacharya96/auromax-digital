<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CmsContent;

class CmsSeeder extends Seeder
{
    public function run(): void
    {
        $content = [
            // Hero
            'hero' => [
                'badge'         => 'Where Business Meets Innovation',
                'heading'       => 'Where Business, Entertainment & Technology',
                'typing_words'  => 'Converge.,Connect.,Inspire.,Innovate.,Transform.',
                'description'   => 'Auromax Digital blends commerce, creativity, and technology into one powerful platform — offering digital and physical products, celebrity-driven experiences, and custom web solutions that help brands and audiences connect like never before.',
                'btn_primary'   => 'Explore Features',
                'btn_secondary' => 'Watch Demo',
                'stat1_value'   => '10',
                'stat1_label'   => 'K+ Users',
                'stat2_value'   => '98',
                'stat2_label'   => '% Satisfaction',
                'stat3_value'   => '50',
                'stat3_label'   => '+ Components',
                'stat4_value'   => '24',
                'stat4_label'   => '/7 Support',
            ],
            // Features
            'features' => [
                'tag'        => '✦ Features',
                'heading'    => 'Everything You Need',
                'subheading' => 'Packed with powerful features to help you build faster and smarter.',
                'f1_icon'    => 'fa-bolt',
                'f1_title'   => 'Lightning Fast',
                'f1_desc'    => 'Optimized for performance with Laravel caching & Vite. Load times under 1 second guaranteed.',
                'f1_color'   => 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
                'f2_icon'    => 'fa-mobile-alt',
                'f2_title'   => 'Fully Responsive',
                'f2_desc'    => 'Looks stunning on every device — from mobile phones to ultra-wide monitors.',
                'f2_color'   => 'linear-gradient(135deg, #00d4ff, #0099cc)',
                'f3_icon'    => 'fa-palette',
                'f3_title'   => 'Customizable',
                'f3_desc'    => 'Easily change colors, fonts, and layouts using CSS variables. Make it yours.',
                'f3_color'   => 'linear-gradient(135deg, #f50057, #ff4081)',
                'f4_icon'    => 'fa-shield-alt',
                'f4_title'   => 'Secure & Reliable',
                'f4_desc'    => 'Built on Laravel\'s battle-tested security: CSRF, XSS protection, and more.',
                'f4_color'   => 'linear-gradient(135deg, #ff9800, #f57c00)',
                'f5_icon'    => 'fa-code',
                'f5_title'   => 'Clean Code',
                'f5_desc'    => 'Well-structured React components and Laravel controllers. Developer-friendly by design.',
                'f5_color'   => 'linear-gradient(135deg, #4caf50, #2e7d32)',
                'f6_icon'    => 'fa-magic',
                'f6_title'   => 'Smooth Animations',
                'f6_desc'    => 'Delightful micro-interactions and animations that enhance user experience.',
                'f6_color'   => 'linear-gradient(135deg, #9c27b0, #6a1b9a)',
            ],
            // Pricing
            'pricing' => [
                'tag'        => '✦ Pricing',
                'heading'    => 'Simple Pricing',
                'subheading' => 'Choose the plan that works best for you. No hidden fees.',
                'p1_name'    => 'Starter',
                'p1_price'   => '9',
                'p1_yearly'  => '7',
                'p1_f1'      => '5 Projects',
                'p1_f2'      => '10GB Storage',
                'p1_f3'      => 'Basic Analytics',
                'p1_f4'      => 'Email Support',
                'p2_name'    => 'Pro',
                'p2_price'   => '29',
                'p2_yearly'  => '23',
                'p2_f1'      => 'Unlimited Projects',
                'p2_f2'      => '100GB Storage',
                'p2_f3'      => 'Advanced Analytics',
                'p2_f4'      => 'Priority Support',
                'p3_name'    => 'Enterprise',
                'p3_price'   => '79',
                'p3_yearly'  => '63',
                'p3_f1'      => 'Unlimited Projects',
                'p3_f2'      => '1TB Storage',
                'p3_f3'      => 'Custom Analytics',
                'p3_f4'      => '24/7 Support',
            ],
            // Team
            'team' => [
                'tag'        => '✦ Team',
                'heading'    => 'Meet the Creators',
                'subheading' => 'The talented people behind Auromax Digital.',
                'm1_name'    => 'Alex Johnson',
                'm1_role'    => 'Lead Developer',
                'm1_bio'     => '10+ years of experience building modern web applications.',
                'm1_initial' => 'A',
                'm1_color'   => 'linear-gradient(135deg, #6c63ff, #00d4ff)',
                'm2_name'    => 'Sara Williams',
                'm2_role'    => 'UI/UX Designer',
                'm2_bio'     => 'Passionate about creating beautiful and intuitive interfaces.',
                'm2_initial' => 'S',
                'm2_color'   => 'linear-gradient(135deg, #f50057, #ff9800)',
                'm3_name'    => 'Mike Chen',
                'm3_role'    => 'Backend Engineer',
                'm3_bio'     => 'Expert in scalable systems and cloud architecture.',
                'm3_initial' => 'M',
                'm3_color'   => 'linear-gradient(135deg, #4caf50, #00d4ff)',
            ],
            // Contact
            'contact' => [
                'tag'        => '✦ Contact',
                'heading'    => 'Get In Touch',
                'subheading' => 'Have a question or want to work together? We\'d love to hear from you.',
                'email'      => 'hello@auromaxdigital.com',
                'phone'      => '+1 (555) 123-4567',
                'location'   => 'Bangalore, India',
            ],
            // Footer
            'footer' => [
                'description' => 'Elevating digital experiences through innovation, creativity, and meaningful connections.',
                'twitter'     => '#',
                'linkedin'    => '#',
                'github'      => '#',
                'instagram'   => '#',
            ],
            // Navbar
            'navbar' => [
                'logo_text' => 'Auromax Digital',
                'cta_text'  => 'Get Started',
            ],
        ];

        foreach ($content as $section => $items) {
            foreach ($items as $key => $value) {
                CmsContent::updateOrCreate(
                    ['section' => $section, 'key' => $key],
                    ['value' => $value]
                );
            }
        }
    }
}
