<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@netone.com',
                'password' => Hash::make('password'),
                'ec_number' => 'EC001',
                'position' => 'System Administrator',
                'status' => 'active',
                'role' => 'Administrator',
            ],
            [
                'name' => 'John Manager',
                'email' => 'manager@netone.com',
                'password' => Hash::make('password'),
                'ec_number' => 'EC002',
                'position' => 'Network Manager',
                'status' => 'active',
                'role' => 'Network Manager',
            ],
            [
                'name' => 'Jane Technician',
                'email' => 'technician@netone.com',
                'password' => Hash::make('password'),
                'ec_number' => 'EC003',
                'position' => 'Field Technician',
                'status' => 'active',
                'role' => 'Field Technician',
            ],
            [
                'name' => 'Bob Technician',
                'email' => 'bob@netone.com',
                'password' => Hash::make('password'),
                'ec_number' => 'EC004',
                'position' => 'Field Technician',
                'status' => 'active',
                'role' => 'Field Technician',
            ],
             [
                'name' => 'Robert Lewandwski',
                'email' => 'robert@netone.com',
                'password' => Hash::make('password'),
                'ec_number' => 'EC005',
                'position' => 'Field Technician',
                'status' => 'active',
                'role' => 'Field Technician',
            ],
             [
                'name' => 'Bukayo Saka',
                'email' => 'saka@netone.com',
                'password' => Hash::make('password'),
                'ec_number' => 'EC006',
                'position' => 'Field Technician',
                'status' => 'active',
                'role' => 'Field Technician',
            ],
             [
                'name' => 'Eling Haaland',
                'email' => 'haaland@netone.com',
                'password' => Hash::make('password'),
                'ec_number' => 'EC007',
                'position' => 'Field Technician',
                'status' => 'active',
                'role' => 'Field Technician',
            ],
        ];

        foreach ($users as $userData) {
            $role = $userData['role'];
            unset($userData['role']);

            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );

            // Assign role
            $user->assignRole($role);
        }
    }
}
