<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'sqlite') {
            // SQLite: use a partial unique index instead of generated columns
            DB::statement("DROP INDEX IF EXISTS uniq_appointment_day_start");
            DB::statement("CREATE UNIQUE INDEX uniq_appointment_day_active_start ON appointments (appointment_date, starts_at) WHERE status IN ('pending','confirmed','completed')");
            return;
        }

        // MySQL: Add generated column that only preserves starts_at for active statuses
        DB::statement("ALTER TABLE appointments ADD COLUMN active_starts_at DATETIME GENERATED ALWAYS AS (CASE WHEN status IN ('pending','confirmed','completed') THEN starts_at ELSE NULL END) STORED");

        // Replace unique index to allow reuse of cancelled slots
        DB::statement("ALTER TABLE appointments DROP INDEX uniq_appointment_day_start");
        DB::statement("CREATE UNIQUE INDEX uniq_appointment_day_active_start ON appointments (appointment_date, active_starts_at)");
    }

    public function down(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'sqlite') {
            DB::statement("DROP INDEX IF EXISTS uniq_appointment_day_active_start");
            DB::statement("CREATE UNIQUE INDEX uniq_appointment_day_start ON appointments (appointment_date, starts_at)");
            return;
        }

        DB::statement("ALTER TABLE appointments DROP INDEX uniq_appointment_day_active_start");
        DB::statement("ALTER TABLE appointments DROP COLUMN active_starts_at");
        DB::statement("CREATE UNIQUE INDEX uniq_appointment_day_start ON appointments (appointment_date, starts_at)");
    }
};
