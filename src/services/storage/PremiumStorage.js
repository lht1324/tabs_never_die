// import { createClient } from "@supabase/supabase-js";
//
// const supabaseUrl = "https://your-supabase-url.supabase.co";
// const supabaseAnonKey = "your-anon-key";
// const supabase = createClient(supabaseUrl, supabaseAnonKey);
//
// class PremiumStorage {
//     constructor(userId) {
//         this.userId = userId;
//     }
//
//     async saveUserTabList(tabList) {
//         const { error } = await supabase
//             .from("user_tabs")
//             .upsert({ user_id: this.userId, tabs: tabList });
//
//         if (error) console.error("Supabase 저장 오류:", error);
//     }
//
//     async getUserTabList() {
//         const { data, error } = await supabase
//             .from("user_tabs")
//             .select("tabs")
//             .eq("user_id", this.userId)
//             .single();
//
//         if (error) {
//             console.error("Supabase 오류:", error);
//             return [];
//         }
//         return data?.tabs || [];
//     }
// }
//
// export default PremiumStorage;
