const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://zrbdfbzkweynbtlbdxjp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyYmRmYnprd2V5bmJ0bGJkeGpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0ODIyMjksImV4cCI6MjA5OTA1ODIyOX0.Wh0F8M3j8DdBdKkvBMGoEjA3Jk9grhCWp5Hvq5GaZ8c";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data, error } = await supabase.from("planning_requests").select("*").limit(1);
  if (error) {
    console.error("Error fetching:", error);
  } else {
    console.log("Columns:", data && data[0] ? Object.keys(data[0]) : "No rows found");
  }
}

main();
