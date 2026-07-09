<?php

namespace Database\Seeders;

use App\Models\Education;
use App\Models\Experience;
use App\Models\PosterProject;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Skill;
use App\Models\User;
use App\Models\UxUiProject;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Mao ChanPha',
                'password' => Hash::make('admin123'),
            ]
        );

        Profile::updateOrCreate(
            ['id' => 1],
            [
                'name' => 'Mao ChanPha',
                'title' => 'Full-Stack Web Developer & Designer',
                'short_bio' => 'I build clean web applications using Laravel, React JS, and modern UI design.',
                'about' => 'I am a Computer Science student and web developer interested in building useful, responsive, and user-friendly websites.',
                'career_goal' => 'My goal is to become a strong full-stack developer who can design, build, and deploy real-world web applications.',
                'email' => 'your-email@example.com',
                'phone' => '+855 00 000 000',
                'location' => 'Phnom Penh, Cambodia',
                'github_url' => 'https://github.com/',
                'linkedin_url' => 'https://linkedin.com/',
                'facebook_url' => 'https://facebook.com/',
            ]
        );

        $skills = [
            ['HTML', 'Frontend', 90],
            ['CSS', 'Frontend', 85],
            ['Bootstrap', 'Frontend', 85],
            ['JavaScript', 'Frontend', 70],
            ['React JS', 'Frontend', 65],
            ['PHP', 'Backend', 75],
            ['Laravel', 'Backend', 75],
            ['MySQL', 'Backend', 70],
            ['REST API', 'Backend', 70],
            ['Figma', 'Design', 80],
            ['Photoshop', 'Design', 70],
            ['Canva', 'Design', 85],
        ];

        foreach ($skills as $index => [$name, $category, $level]) {
            Skill::firstOrCreate(
                ['name' => $name],
                [
                    'category' => $category,
                    'level' => $level,
                    'sort_order' => $index + 1,
                    'is_active' => true,
                ]
            );
        }

        Project::firstOrCreate(
            ['slug' => 'student-management-system'],
            [
                'title' => 'Student Management System',
                'description' => 'A Laravel system for managing students, teachers, courses, enrollment, and dashboard statistics.',
                'technologies' => ['Laravel', 'MySQL', 'Bootstrap', 'REST API'],
                'category' => 'Laravel',
                'github_url' => 'https://github.com/',
                'live_demo_url' => 'https://example.com',
                'is_featured' => true,
            ]
        );

        Project::firstOrCreate(
            ['slug' => 'react-ecommerce-template'],
            [
                'title' => 'React E-commerce Template',
                'description' => 'A responsive e-commerce frontend built with React components, product cards, cart UI, and modern layout.',
                'technologies' => ['React JS', 'Bootstrap', 'Axios'],
                'category' => 'React',
                'github_url' => 'https://github.com/',
                'live_demo_url' => 'https://example.com',
                'is_featured' => true,
            ]
        );

        UxUiProject::firstOrCreate(
            ['slug' => 'mobile-banking-ui'],
            [
                'title' => 'Mobile Banking UI Concept',
                'description' => 'A clean mobile banking interface concept focused on simple navigation and modern cards.',
                'tools' => ['Figma'],
                'category' => 'Mobile App',
            ]
        );

        PosterProject::firstOrCreate(
            ['slug' => 'event-poster-design'],
            [
                'title' => 'Event Poster Design',
                'description' => 'A social media poster design for a school or technology event.',
                'tools' => ['Photoshop', 'Canva'],
                'category' => 'Social Media',
            ]
        );

        Education::firstOrCreate(
            [
                'institution' => 'Western University',
                'major' => 'Computer Science',
            ],
            [
                'degree' => 'Bachelor Degree',
                'start_year' => 2022,
                'end_year' => null,
                'is_current' => true,
                'description' => 'Studying computer science, web development, programming, database, and system analysis.',
            ]
        );

        Experience::firstOrCreate(
            [
                'organization' => 'Volunteer Organization',
                'role' => 'Volunteer Designer',
            ],
            [
                'start_date' => '2025-01-01',
                'end_date' => null,
                'is_current' => true,
                'description' => 'Supported volunteer activities by designing posters and helping with event promotion.',
            ]
        );
    }
}