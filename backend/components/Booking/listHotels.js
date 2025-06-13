// file: components/Hotel/listHotels.js

import { database as db } from "../config/firebaseconfig.js";
import { ref, get } from "firebase/database";

export async function listHotels(req, res) {
    try {
        const hotelsRef = ref(db, 'Hotels'); // Tham chiếu đến node 'Hotels' (chữ H viết hoa)
        const snapshot = await get(hotelsRef);

        if (!snapshot.exists()) {
            return res.status(200).json([]); // Trả về mảng rỗng nếu không có khách sạn nào
        }

        const hotelsData = snapshot.val();
        
        // Biến đổi dữ liệu từ Firebase thành định dạng frontend cần
        const formattedHotels = Object.keys(hotelsData).map(key => {
            const hotel = hotelsData[key];

            // Lấy giá phòng theo đêm của loại phòng đầu tiên làm giá đại diện
            const representativePrice = hotel.RoomTypes && hotel.RoomTypes[0] ? hotel.RoomTypes[0].PriceByNight : 0;
            
            // Thêm một ảnh mẫu vì trong database chưa có trường ảnh
            const imageUrl = hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';

            return {
                id: key, // ID của khách sạn chính là key
                name: hotel.Name,
                location: hotel.Location,
                rating: hotel.rating,
                price: representativePrice,
                image: imageUrl,
                amenities: hotel.amenities || [],
                features: [] // Bạn có thể thêm trường này vào database nếu cần
            };
        });

        return res.status(200).json(formattedHotels);

    } catch (error) {
        console.error("Error listing hotels:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}