<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    public function up(): void
    {
        $admin = DB::table('users')->where('email', 'admin@example.com');

        if ($admin->exists()) {
            $admin->update([
                'name' => 'Mao ChanPha',
                'password' => Hash::make('password123'),
                'updated_at' => now(),
            ]);

            return;
        }

        DB::table('users')->insert([
            'email' => 'admin@example.com',
            'name' => 'Mao ChanPha',
            'password' => Hash::make('password123'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        // Keep the admin account when rolling back this deployment migration.
    }
};
