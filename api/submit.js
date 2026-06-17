export default async function handler(req, res) {
    // শুধুমাত্র POST রিকোয়েস্ট অ্যালাউ করা হচ্ছে
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Vercel Environment Variable থেকে সিক্রেট URL টি নেওয়া হচ্ছে
        const scriptURL = process.env.GOOGLE_SCRIPT_URL;

        if (!scriptURL) {
            return res.status(500).json({ error: 'Server configuration error: URL missing.' });
        }

        // ফ্রন্টএন্ড থেকে আসা ডাটা রিসিভ করা (JSON আকারে আসবে)
        const bodyData = req.body;

        // FormData ফরম্যাটে গুগল অ্যাপস স্ক্রিপ্টে ডাটা পাঠানোর প্রিপারেশন
        const formData = new URLSearchParams();
        formData.append('Name', bodyData.Name);
        formData.append('CurrentTeam', bodyData.CurrentTeam);
        formData.append('NewTeam', bodyData.NewTeam);

        // ব্যাকএন্ড থেকে গুগল শিটে রিকোয়েস্ট পাঠানো
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const result = await response.text();
        
        // ফ্রন্টএন্ডে সাকসেস রেসপন্স পাঠানো
        return res.status(200).json({ success: true, data: result });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}