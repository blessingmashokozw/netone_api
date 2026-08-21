<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RegionsAndLocationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Seed regions
        $regions = [
            ['name' => 'Chiredzi_MC', 'status' => 'active'],
            ['name' => 'Chivhu_MC', 'status' => 'active'],
            ['name' => 'MASVINGO NORTH_MC', 'status' => 'active'],
            ['name' => 'MASVINGO SOUTH_MC', 'status' => 'active'],
        ];

        DB::table('regions')->insertOrIgnore($regions);

        // Get region IDs
        $regionIds = DB::table('regions')->pluck('id', 'name');

        // Seed locations with region associations
        $regionLocations = [
            'Chiredzi_MC' => [
                "BENZI", "BOLI", "CHIKOMBEDZI", "CHILO", "CHILONGA", "Chiredzi", "CHIREDZI EXCHANGE",
                "CHIREDZI MAKONDO", "CHIREDZI POLICE", "CHIREDZI SHOP", "CHIREDZI ZBC TOWER", "DINHE",
                "FAIR RANGE", "GEZANI", "GONDORA", "HIPPO VALLEY", "JERERA", "JERERA GROWTH POINT",
                "MAKHANANI", "MAKOSE", "MALIPATI", "MARANDA", "MASAKA", "MASHOKO", "MKWASINE",
                "MUTANDAHWE", "NESHURO", "NGUNDU", "NGWANA RANGE", "NYONI", "PAHLELA", "RENCO MINE",
                "RENCO MOUNTAIN", "RUTENGA EXCHANGE", "RUTENGA ZBC", "SANGO BORDER POST", "SVUURE",
                "TRIANGLE", "TRIANGLE 2", "TSHOVANI", "TSHOVANI 3", "TSHOVANI TOWNSHIP", "VILE VILE", "ZOMBA"
            ],
            'Chivhu_MC' => [
                "ALTRINA FARM", "BARU", "BEATRICE", "BEDZA", "CHIVHU", "CHIVHU 2", "CHIVHU FOUNTAIN STREET",
                "CHIVHU HIGHVIEW", "CHIVHU LOW DENSITY", "CHIVHU ZBC", "CHIVHU ZRP", "DISCO MINE",
                "ELDORADO", "ENONDO", "FEATHERSTONE", "FEATHERSTONE POLICE", "GOMBE", "GWIRAMBIRA",
                "LTE_CHIVHU SHOP", "MABHANDE", "MAMINA", "MUBAYIRA", "MURAMBINDA", "MURAMBINDA WATER TANKS",
                "NHARIRA BC", "NYAMWEDA", "RUZAMBO", "ST FRANCIS", "THE RANGE", "WYLDGROOVE"
            ],
            'MASVINGO NORTH_MC' => [
                "BIKITA MINERALS", "CHARTSWORTH", "CHINYIKA", "Chirumhanzu", "DOMBORENDAU", "FAIRFIELDS",
                "GLEN LIVET", "GOKOMERE", "GUTU", "GUTU MUPANDAWANA", "HOLY CROSS", "MASHAYABVUDZI BEERHALL",
                "MASVINGO CBD ZESA DEPOT", "MASVINGO EXCHANGE", "MASVINGO INDUSTRIES", "MASVINGO SHOP",
                "MT RASA", "MUSHAGASHE TRAINING", "MUTENDI", "MVUMA", "MVUMA TOWN", "NYIKA GROWTH POINT",
                "RHODENE", "ROY", "RUTI", "SWIZWE", "VICTORIA HIGH SCHOOL", "VUMBA", "ZIMUTO MISSION"
            ],
            'MASVINGO SOUTH_MC' => [
                "4 BRIGADE", "BIKITA", "BUKA", "CHIKATO POLICE", "CHIVENGAMBIZI", "DANAMOMBE SCHOOL",
                "FLAMBOYANT HOTEL", "GREAT ZIMBABWE UNIVERSITY", "HANYANYA", "MAJANGE", "MARINGIRE",
                "MASVINGO CAIPF", "MORGENSTER", "MUCHEKE", "MUCHEKE WATER TANKS", "NDANGA", "NEMANWA",
                "NEMASHAKWE", "NGOMAHURU MOUNTAIN", "NYIKA", "REVULI", "RUJEKO SHOPPING CENTRE",
                "RUNYARARO TL", "SVIBA MOUNTAIN", "VICTORIA RANGE", "VICTORIA RANGE SHOPS"
            ]
        ];

        foreach ($regionLocations as $regionName => $locations) {
            $regionId = $regionIds[$regionName];
            
            foreach ($locations as $locationName) {
                DB::table('locations')->insertOrIgnore([
                    'name' => $locationName,
                    'region_id' => $regionId,
                    'latitude' => null,
                    'longitude' => null,
                ]);
            }
        }
    }
}
