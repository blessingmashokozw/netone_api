<?php

namespace Database\Seeders;

use App\Models\SiteItem;
use DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SiteItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            ['name' => 'Fuel Level', 'data_type' => 'float', 'optional' => true, 'is_active' => true],
            ['name' => 'Fuel Added', 'data_type' => 'float', 'optional' => true, 'is_active' => true],
            ['name' => 'Total Fuel', 'data_type' => 'float', 'optional' => true, 'is_active' => true],
            ['name' => 'DEG OIL Level', 'data_type' => 'string', 'optional' => true, 'is_active' => true],
            ['name' => 'Current Meter', 'data_type' => 'string', 'optional' => true, 'is_active' => true],
            ['name' => 'Coolant Level', 'data_type' => 'string', 'optional' => true, 'is_active' => true],
            ['name' => 'ZESA Units', 'data_type' => 'string', 'optional' => true, 'is_active' => true],
            ['name' => 'DEG Auto Start', 'data_type' => 'string', 'optional' => true, 'is_active' => true],
            ['name' => 'Service Status', 'data_type' => 'string', 'optional' => true, 'is_active' => true],
        ];

        foreach ($items as $key => $value) {
            if (SiteItem::where('name', $value['name'])->exists()) {
                continue;
            }
            $item = new SiteItem();
            $item->name = $value['name'];
            $item->data_type = $value['data_type'];
            $item->optional = $value['optional'];
            $item->is_active = $value['is_active'];
            $item->save();
        }



    }
}
