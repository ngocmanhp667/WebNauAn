const dotenv = require('dotenv');
dotenv.config();

class AIService {
    async getFridgeSuggestions({ ingredients, peopleCount, complexity, cookingSpeed, dishCount }) {
        const apiKey = process.env.GEMINI_API_KEY;
        const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';

        if (!apiKey) {
            const error = new Error('Thiếu GEMINI_API_KEY trong cấu hình hệ thống');
            error.statusCode = 500;
            throw error;
        }

        const ingredientsText = Array.isArray(ingredients) ? ingredients.join(', ') : ingredients;
        
        // Tạo prompt chi tiết cho Gemini
        const prompt = `Bạn là một đầu bếp chuyên nghiệp và chuyên gia dinh dưỡng của hệ thống MâmNgon.
Người dùng đang có các loại thực phẩm sau đây trong tủ lạnh: [ ${ingredientsText} ].

Hãy gợi ý ĐÚNG ${dishCount || 3} món ăn ngon miệng có thể nấu bằng cách sử dụng tối đa các thực phẩm này (người dùng đã có sẵn các gia vị cơ bản như: muối, đường, hạt nêm, nước mắm, tiêu, dầu ăn, hành, tỏi). Không được gợi ý nhiều hơn hoặc ít hơn ${dishCount || 3} món.

Yêu cầu bữa ăn phải đáp ứng các tiêu chí sau:
- Khẩu phần ăn dành cho: ${peopleCount} người ăn.
- Độ phức tạp mong muốn: ${complexity} (nếu đơn giản thì gợi ý món chế biến nhanh gọn, nếu phức tạp thì gợi ý món cầu kỳ, chuẩn vị).
- Tốc độ chế biến: ${cookingSpeed} (nếu nhanh thì ưu tiên món dưới 25 phút, nếu chậm thì có thể gợi ý món hầm, kho cầu kỳ).

BẮT BUỘC TRẢ VỀ DƯỚI DẠNG MỘT MẢNG JSON HỢP LỆ (ARRAY OF OBJECTS). Mỗi món ăn là một đối tượng JSON có đúng cấu trúc sau:
{
    "name": "Tên món ăn (Ví dụ: Trứng cuộn cà chua)",
    "description": "Mô tả ngắn gọn và hấp dẫn về món ăn",
    "fridgeIngredientsUsed": ["nguyên liệu dùng từ tủ lạnh, ghi rõ loại thực phẩm ví dụ: Trứng, Cà chua"],
    "additionalIngredientsNeeded": ["gia vị hoặc nguyên liệu cần chuẩn bị thêm ngoài gia vị cơ bản, nếu không cần ghi mảng rỗng"],
    "prepTime": 10,
    "cookTime": 15,
    "difficulty": "dễ",
    "steps": [
        "Bước 1: ...",
        "Bước 2: ...",
        "Bước 3: ..."
    ]
}

YÊU CẦU QUAN TRỌNG VỀ TRƯỜNG "steps":
Mỗi bước trong mảng "steps" phải được viết CHI TIẾT và ĐẦY ĐỦ, bao gồm:
- Định lượng cụ thể cho ${peopleCount} người ăn (ví dụ: "3 quả trứng", "200g thịt", "2 thìa canh nước mắm").
- Mức lửa cụ thể khi nấu (ví dụ: "lửa vừa", "lửa lớn", "lửa nhỏ liu riu").
- Thời gian cụ thể cho từng thao tác (ví dụ: "xào khoảng 2-3 phút", "hầm trong 20 phút").
- Dấu hiệu nhận biết để người nấu biết khi nào đạt yêu cầu (ví dụ: "đến khi hành tỏi vàng thơm", "khi nước sốt sệt lại và bám đều vào thịt").
- Mẹo nấu nướng nếu có (ví dụ: "Lưu ý không khuấy quá nhiều để trứng không bị nát").
Mỗi bước nên dài từ 2-4 câu. Tổng cộng mỗi món nên có từ 4-7 bước tùy độ phức tạp. Tuyệt đối KHÔNG viết bước quá ngắn gọn kiểu chỉ 1 câu sơ sài.

Hãy chỉ trả về dữ liệu JSON thô. Không bọc trong cặp dấu nháy hay khối code \`\`\`json ... \`\`\`, không viết thêm bất kỳ lời thoại, văn bản giải thích nào khác ngoài chuỗi JSON hợp lệ.`;

        let attempt = 0;
        const maxAttempts = 3;
        let activeModel = modelName;

        while (attempt < maxAttempts) {
            attempt++;
            try {
                console.log(`🤖 Đang kết nối Gemini API (Lần thử ${attempt}/${maxAttempts}) sử dụng model: ${activeModel}...`);
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${apiKey}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: prompt
                                    }
                                ]
                            }
                        ],
                        generationConfig: {
                            responseMimeType: 'application/json'
                        }
                    })
                });

                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
                }

                const data = await response.json();
                const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!aiText) {
                    throw new Error('Không nhận được phản hồi từ mô hình AI');
                }

                const parsedSuggestions = JSON.parse(aiText.trim());
                console.log('✅ AI gợi ý thành công!');
                return parsedSuggestions;

            } catch (error) {
                console.warn(`⚠️ Lỗi ở lần thử ${attempt}:`, error.message);
                
                if (attempt < maxAttempts) {
                    // Nếu gặp lỗi quá tải hoặc hết hạn, đổi sang model dự phòng gemini-2.5-flash ổn định hơn
                    if (activeModel !== 'gemini-2.5-flash') {
                        console.log('🔄 Đang tự động đổi sang model dự phòng: gemini-2.5-flash...');
                        activeModel = 'gemini-2.5-flash';
                    }
                    // Chờ 2 giây trước khi thử lại
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } else {
                    console.error('❌ Đã thử lại tối đa nhưng vẫn thất bại.');
                    const err = new Error(error.message || 'Lỗi khi kết nối với dịch vụ gợi ý AI');
                    err.statusCode = 500;
                    throw err;
                }
            }
        }
    }
}

module.exports = new AIService();
