// =================================================================
// HỆ THỐNG THOẠI CHO GAME "CON ĐƯỜNG HỌC VẤN"
// =================================================================
const GameDialogues = {
    // =================================================================
    // THOẠI KHI VƯỢT QUA CỘT MỐC (SUCCESS)
    // =================================================================
    
    // Lớp 1 -> Lớp 2 (Cột mốc thường)
    grade1_success: [
        "Tuyệt vời! Bạn đã tích lũy đủ kiến thức! 📚",
        "Bước nhảy hoàn hảo! Lượng đã chuyển hóa thành chất! ✨",
        "Chính xác! Đúng lúc, đúng chỗ! 🎯",
        "Xuất sắc! Bạn hiểu được điểm nút rồi! 💡",
        "Tuyệt! Không nôn nóng, không trì trệ! 👏",
        "Perfect timing! Đây mới là bước nhảy chất lượng! 🌟",
        "Giỏi lắm! Cây cầu tri thức vững chắc! 🌉",
        "Wow! Bạn đang nắm được quy luật rồi đấy! 🎓"
    ],
    
    // Lớp 2 -> Lớp 3
    grade2_success: [
        "Tuyệt vời! Tiếp tục duy trì nhịp độ này! 🚀",
        "Bạn đang tiến bộ nhanh đấy! 📈",
        "Chất lượng tích lũy ngày càng cao! ⭐",
        "Cứ như thế này là bạn sẽ thành Giác Ngộ Giả mất! 🎯",
        "Hoàn hảo! Đây là bước nhảy đáng giá! 💎",
        "Nice! Bạn đã tránh được bẫy của Ảo Ma Tả Khuynh! 🌀",
        "Great! Không để Bóng Tối Hữu Khuynh làm chậm bước! 🌑",
        "Xuất sắc! Tri thức của bạn đang lên tầm cao mới! 📚"
    ],
    
    // Lớp 3 -> Lớp 4
    grade3_success: [
        "Ấn tượng! Nền tảng của bạn đã rất vững! 🏗",
        "Tuyệt! Mỗi bước đều chắc chắn! 💪",
        "Bạn đang làm chủ được quy luật Lượng - Chất rồi! ⚖️",
        "Wonderful! Kiến thức đang tích tụ đều đặn! 📊",
        "Chuẩn! Đúng timing, đúng độ! 🎯",
        "Amazing! Bước nhảy ngày càng chính xác! 🎪",
        "Siêu phàm! Bạn đang trên đà phát triển tốt! 🌱",
        "Tốt lắm! Hãy giữ vững phong độ này! 🔥"
    ],
    
    // Lớp 4 -> Lớp 5 (CHECKPOINT - Kỳ thi lớp 5)
    grade4_to_checkpoint5: [
        "Hoàn hảo! Chuẩn bị cho kỳ thi Lớp 5 nào! 📝",
        "Bước nhảy thành công! Giờ là lúc kiểm tra kiến thức! 🎓",
        "Tuyệt! Đến checkpoint rồi, sẵn sàng chứng minh năng lực chưa? 💪",
        "Xuất sắc! Hãy cho mọi người thấy bạn học được gì! 📚",
        "Nice! Bài kiểm tra đang chờ đón bạn đấy! ✍️",
        "Giỏi quá! Đã đến lúc thử thách bản thân! 🎯",
        "Perfect! Checkpoint Lớp 5 - Let's go! 🚀"
    ],
    
    // Vượt qua Kỳ thi Lớp 5 (MAJOR MILESTONE)
    checkpoint5_passed: [
        "🎉 CHÚC MỪNG! ĐẠT CHECKPOINT LỚP 5! 🎉",
        "⭐ BƯỚC NHẢY LỊCH SỬ! CHẤT MỚI RA ĐỜI! ⭐",
        "🏆 XUẤT SẮC! BẠN ĐÃ HOÀN THÀNH TIỂU HỌC! 🏆",
        "🎓 TUYỆT VỜI! CHÀO MỪNG ĐẾN CẤP TRUNG HỌC! 🎓",
        "✨ AMAZING! HÀNH TRÌNH THĂNG HOA BẮT ĐẦU! ✨",
        "💎 PERFECT! BẠN ĐÃ CHUYỂN HÓA HOÀN TOÀN! 💎",
        "🌟 INCREDIBLE! NỀN TẢNG ĐÃ VỮNG CHẮC! 🌟"
    ],
    
    // Lớp 5 -> Lớp 6 (Sau checkpoint)
    grade5_success: [
        "Tuyệt! Bắt đầu hành trình THCS thật tốt! 👦",
        "Nice! Bạn đang thích nghi nhanh đấy! 🌱",
        "Tốt lắm! Độ khó tăng nhưng bạn vẫn vượt qua! 💪",
        "Great! Cấp độ mới, tinh thần mới! 🔥",
        "Xuất sắc! Chất lượng học tập vẫn duy trì tốt! 📈",
        "Perfect! Không hề bị choáng ngợp! 🎯",
        "Giỏi! Bước chuyển tiếp rất mượt mà! 🌉"
    ],
    
    // Lớp 6,7,8 -> Tiếp (Giai đoạn THCS)
    middle_school_success: [
        "Tuyệt vời! Đang trên đà chinh phục THCS! 📚",
        "Xuất sắc! Mỗi bước đều có tiến bộ! 📊",
        "Nice work! Kiến thức ngày càng sâu rộng! 🌟",
        "Tốt lắm! Bạn đang làm chủ được nhịp độ! ⚖️",
        "Great! Hãy tiếp tục phát huy! 🚀",
        "Perfect! Không ngừng vươn lên! 💫",
        "Amazing! Chất lượng tích lũy rất tốt! ✨",
        "Wonderful! Bước nhảy ngày càng chính xác! 🎯"
    ],
    
    // Lớp 8 -> Lớp 9 (Chuẩn bị checkpoint lớp 9)
    grade8_to_checkpoint9: [
        "Tuyệt! Chuẩn bị cho kỳ thi Lớp 9 thôi! 📝",
        "Xuất sắc! THCS sắp hoàn thành rồi đấy! 🎓",
        "Perfect! Hãy chứng minh năng lực của mình! 💪",
        "Nice! Checkpoint quan trọng đang đến gần! 🎯",
        "Giỏi quá! Sẵn sàng cho thử thách lớn chưa? 🏆",
        "Great timing! Bài kiểm tra chờ bạn kìa! ✍️"
    ],
    
    // Vượt qua Kỳ thi Lớp 9 (MAJOR MILESTONE)
    checkpoint9_passed: [
        "🎉 XUẤT SẮC! VƯỢT QUA CHECKPOINT LỚP 9! 🎉",
        "⭐ BƯỚC NHẢY VĨ ĐẠI! CHÀO THPT! ⭐",
        "🏆 TUYỆT VỜI! THCS ĐÃ CHINH PHỤC XONG! 🏆",
        "🎓 AMAZING! CHẤT MỚI - HỌC SINH TRUNG HỌC PHỔ THÔNG! 🎓",
        "✨ INCREDIBLE! ĐÃ BƯỚC VÀO GIAI ĐOẠN QUYẾT ĐỊNH! ✨",
        "💎 PERFECT! NỀN MÓNG VỮNG CHẮC CHO TƯƠNG LAI! 💎",
        "🌟 OUTSTANDING! HÀNH TRÌNH THĂNG HOA TIẾP TỤC! 🌟"
    ],
    
    // Lớp 9 -> Lớp 10 (Bắt đầu THPT)
    grade9_success: [
        "Tuyệt! Chào mừng đến với THPT! 🧑‍🎓",
        "Xuất sắc! Giai đoạn quyết định đã bắt đầu! 🎯",
        "Perfect! Độ khó cao hơn nhưng bạn xử lý tốt! 💪",
        "Nice! Bạn đang thích ứng rất nhanh! 🌱",
        "Great! Chất lượng học tập vẫn đỉnh cao! 📈",
        "Amazing! Không ngừng phát triển! 🚀",
        "Wonderful! Hãy giữ vững phong độ! 🔥"
    ],
    
    // Lớp 10,11 -> Tiếp (Giai đoạn THPT)
    high_school_success: [
        "Tuyệt vời! Đang trên đà chinh phục THPT! 📚",
        "Xuất sắc! Tri thức ngày càng sâu sắc! 🧠",
        "Perfect timing! Bước nhảy chuẩn xác! ⚖️",
        "Nice work! Không bị lung lay bởi khó khăn! 💎",
        "Great! Mỗi cột mốc đều vượt qua đẹp! 🌟",
        "Amazing! Bạn đang làm chủ quy luật! 🎓",
        "Outstanding! Hãy tiếp tục như thế! 🏆",
        "Excellent! Đại học đang đến gần! 🎯"
    ],
    
    // Lớp 11 -> Lớp 12 (Chuẩn bị checkpoint cuối THPT)
    grade11_to_checkpoint12: [
        "Perfect! Chuẩn bị cho kỳ thi Tốt nghiệp THPT! 📝",
        "Tuyệt! Cột mốc quan trọng nhất sắp đến! 🎓",
        "Xuất sắc! Hãy chứng tỏ tất cả những gì đã học! 💪",
        "Great! Đại học đang chờ bạn phía trước! 🏫",
        "Nice! Thử thách cuối cùng của THPT! 🎯",
        "Amazing! Sẵn sàng cho bước nhảy lớn nhất chưa? 🚀"
    ],
    
    // Vượt qua Kỳ thi Lớp 12 (CRITICAL MILESTONE)
    checkpoint12_passed: [
        "🎉🎉 XUẤT SẮC! TỐT NGHIỆP THPT! 🎉🎉",
        "⭐⭐ BƯỚC NHẢY VĨ ĐẠI NHẤT! CHÚC MỪNG! ⭐⭐",
        "🏆🏆 INCREDIBLE! CỬA ĐẠI HỌC ĐÃ MỞ! 🏆🏆",
        "🎓🎓 AMAZING! CHẤT MỚI - SINH VIÊN ĐẠI HỌC! 🎓🎓",
        "✨✨ PHENOMENAL! ĐÃ CHỨNG MINH NĂNG LỰC! ✨✨",
        "💎💎 PERFECT! HÀNH TRÌNH THĂNG HOA TỚI ĐỈNH CAO! 💎💎",
        "🌟🌟 LEGENDARY! HELL MODE ĐÃ ĐƯỢC MỞ KHÓA! 🌟🌟"
    ],
    
    // Đại học (HELL MODE) - Vượt cột mốc
    university_success: [
        "😱 OMG! BẠN LÀM ĐƯỢC TRONG HELL MODE! 😱",
        "🔥 INSANE! ĐẲNG CẤP SINH VIÊN THẬT! 🔥",
        "💪 SIÊU PHÀM! TRI THỨC ĐỈNH CAO! 💪",
        "🎯 PERFECT! SỰ TẬP TRUNG TUYỆT ĐỐI! 🎯",
        "⚡ LEGENDARY! KHÔNG THỂ TIN ĐƯỢC! ⚡",
        "🌟 GODLIKE! ĐÚNG LÀ GIÁC NGỘ GIẢ! 🌟",
        "👑 KING/QUEEN! BƯỚC NHẢY HOÀN HẢO! 👑",
        "🚀 AMAZING! GẦN TỚI ĐỈNH CAO RỒI! 🚀"
    ],
    
    // Tốt nghiệp Đại học (ULTIMATE ACHIEVEMENT)
    university_graduated: [
        "🏆🎓 GIÁC NGỘ GIẢ ĐÃ RA ĐỜI! 🎓🏆",
        "👑⭐ HUYỀN THOẠI! BẠN ĐÃ CHINH PHỤC TẤT CẢ! ⭐👑",
        "💎✨ PERFECT! TRI THỨC ĐỈNH CAO ĐẠT ĐƯỢC! ✨💎",
        "🌟🔥 INCREDIBLE! LƯỢNG - CHẤT - BƯỚC NHẢY ĐÃ THÀNH THẠO! 🔥🌟",
        "🎊🎉 PHENOMENAL! CON ĐƯỜNG HỌC VẤN HOÀN THÀNH! 🎉🎊",
        "⚡💫 LEGENDARY ACHIEVEMENT UNLOCKED! 💫⚡"
    ],
    
    // =================================================================
    // THOẠI KHI THẤT BẠI (FAILURE)
    // =================================================================
    
    // Ngã cầu ở Lớp 1-4 (Chưa đến checkpoint)
    early_failure: [
        "Oops! Hơi nôn nóng rồi! Tích lũy thêm kiến thức nào! 📚",
        "Ối! Tả khuynh kìa! Cần thêm thời gian tích lũy! ⏰",
        "Chưa đủ lượng đâu bạn ơi! Cần chắc chắn hơn! 💪",
        "Ups! Vội vàng quá rồi! Hãy kiên nhẫn hơn! 🐢",
        "Oh no! Bước nhảy chưa đúng lúc! Thử lại nha! 🔄",
        "Ảo Ma Tả Khuynh đã ảnh hưởng bạn rồi! Bình tĩnh! 🌀",
        "Chưa được! Cần xây nền móng vững hơn! 🏗",
        "Sai rồi! Đừng vội, hãy đều đặn! 📈"
    ],
    
    // Ngã cầu ở Lớp 5-8 (Giữa THCS)
    middle_failure: [
        "Aduh! Có vẻ hơi vội rồi! Bình tĩnh lại nha! 😅",
        "Ối dào! Cầu dài quá hay ngắn quá rồi! 🌉",
        "Oops! Chưa nắm được điểm nút! Thử lại đi! 🎯",
        "Ôi! Timing chưa chuẩn! Cần tập trung hơn! 🧘",
        "Oh no! Lượng chưa đủ để chuyển hóa thành chất! ⚖️",
        "Chưa đạt! Hãy cảm nhận đúng thời điểm! ⏱️",
        "Sai lầm nhỏ thôi! Điều chỉnh và tiếp tục! 🔧",
        "Chưa được! Cần kiên định hơn nữa! 💎"
    ],
    
    // Ngã cầu ở Lớp 9-11 (THPT)
    high_failure: [
        "Oh no! Giai đoạn quan trọng mà lại mất tập trung! 😰",
        "Ối! THPT khó hơn đúng không? Bình tĩnh nào! 🧘‍♂️",
        "Chưa đạt! Hơi hữu khuynh rồi, đừng dè chừng quá! 🌑",
        "Oops! Bóng Tối Hữu Khuynh đã ảnh hưởng bạn! 👻",
        "Sai rồi! Đã tích lũy đủ mà vẫn chần chừ! ⏰",
        "Thất bại! Cần tự tin hơn để thực hiện bước nhảy! 💪",
        "Chưa được! Đừng để cơ hội trôi qua! 🌊",
        "Oh dear! Phải nắm bắt đúng điểm nút chứ! 🎯"
    ],
    
    // Ngã cầu ở Đại học (HELL MODE - Rất nghiêm trọng)
    university_failure: [
        "💀 ÔI KHÔNG! HELL MODE KHÔNG RƯA THỨ LỖI! 💀",
        "😱 THẤT BẠI! QUAY VỀ CHECKPOINT! 😱",
        "🌪 KHỦNG HOẢNG! HÃY XÂY DỰNG LẠI TỪ ĐẦU! 🌪",
        "⚠️ SAI SÓT NGHIÊM TRỌNG! ĐẠI HỌC KHÔNG DỄ CHỊU! ⚠️",
        "💥 THẤT BẠI! ĐÂY LÀ THỰC TẾ KHỐC LIỆT! 💥",
        "❌ FAIL! PHẢI HỌC LẠI NỀN TẢNG! ❌",
        "🔥 CÁI GIÁ CỦA SỰ CHỦ QUAN! 🔥",
        "⛔ THUA! ĐẠI HỌC KHÔNG CHẤP NHẬN SAI SÓT! ⛔"
    ],
    
    // Trượt kỳ thi Lớp 5
    checkpoint5_failed: [
        "😢 TRƯỢT! Quay về Lớp 1! Kiến thức chưa vững!",
        "😞 CHƯA ĐẠT! Hãy xây dựng lại nền tảng từ đầu!",
        "😔 FAIL! Cần học kỹ hơn nữa! Reset về Lớp 1!",
        "😓 OH NO! Lượng chưa đủ! Về checkpoint Lớp 1!",
        "😰 KHÔNG ĐẠT! Cần tích lũy thêm! Restart!",
        "😨 THUA! Nền móng chưa chắc! Bắt đầu lại!"
    ],
    
    // Trượt kỳ thi Lớp 9
    checkpoint9_failed: [
        "😢 TRƯỢT! Quay về Lớp 6! Còn thiếu sót!",
        "😞 FAIL! Cần củng cố thêm! Reset về Lớp 6!",
        "😔 CHƯA ĐẠT! Về checkpoint Lớp 6 thôi!",
        "😓 ÔI! Kiến thức THCS chưa vững! Lại từ đầu!",
        "😰 THUA! Phải học lại! Quay về Lớp 6!",
        "😨 KHÔNG QUA! Hãy nỗ lực hơn! Restart!"
    ],
    
    // Trượt kỳ thi Lớp 12
    checkpoint12_failed: [
        "😭 TRƯỢT TỐT NGHIỆP! Quay về Lớp 10!",
        "😢 FAIL! Ước mơ Đại học còn xa! Reset Lớp 10!",
        "😞 KHÔNG ĐẠT! Cần học lại! Về Lớp 10!",
        "😔 THUA! THPT chưa hoàn thành! Checkpoint Lớp 10!",
        "😓 OH NO! Cơ hội đã qua! Bắt đầu từ Lớp 10!",
        "😰 TRƯỢT! Nền tảng cần vững hơn! Reset!"
    ]
};

// =================================================================
// HÀM LẤY THOẠI NGẪU NHIÊN
// =================================================================
function getRandomDialogue(category) {
    const dialogues = GameDialogues[category];
    if (!dialogues || dialogues.length === 0) {
        return "Tiếp tục cố gắng nha! 💪";
    }
    return dialogues[Math.floor(Math.random() * dialogues.length)];
}

// =================================================================
// HÀM LẤY THOẠI THEO NGỮ CẢNH GAME
// =================================================================
function getSuccessDialogue(currentGrade, isCheckpoint = false) {
    if (isCheckpoint) {
        if (currentGrade === 5) return getRandomDialogue('checkpoint5_passed');
        if (currentGrade === 9) return getRandomDialogue('checkpoint9_passed');
        if (currentGrade === 12) return getRandomDialogue('checkpoint12_passed');
        if (currentGrade === 16) return getRandomDialogue('university_graduated'); // Tốt nghiệp ĐH
    }
    
    // Đại học (Hell Mode)
    if (currentGrade >= 13) {
        return getRandomDialogue('university_success');
    }
    
    // Chuẩn bị checkpoint
    if (currentGrade === 4) return getRandomDialogue('grade4_to_checkpoint5');
    if (currentGrade === 8) return getRandomDialogue('grade8_to_checkpoint9');
    if (currentGrade === 11) return getRandomDialogue('grade11_to_checkpoint12');
    
    // Lớp thường
    if (currentGrade <= 1) return getRandomDialogue('grade1_success');
    if (currentGrade === 2) return getRandomDialogue('grade2_success');
    if (currentGrade === 3) return getRandomDialogue('grade3_success');
    if (currentGrade === 5) return getRandomDialogue('grade5_success');
    if (currentGrade >= 6 && currentGrade <= 8) return getRandomDialogue('middle_school_success');
    if (currentGrade === 9) return getRandomDialogue('grade9_success');
    if (currentGrade >= 10 && currentGrade <= 12) return getRandomDialogue('high_school_success');
    
    return getRandomDialogue('grade1_success'); // Default
}

function getFailureDialogue(currentGrade, failedAtCheckpoint = false) {
    // Trượt checkpoint
    if (failedAtCheckpoint) {
        if (currentGrade === 5) return getRandomDialogue('checkpoint5_failed');
        if (currentGrade === 9) return getRandomDialogue('checkpoint9_failed');
        if (currentGrade === 12) return getRandomDialogue('checkpoint12_failed');
    }
    
    // Đại học (Hell Mode) - RẤT NGHIÊM TRỌNG
    if (currentGrade >= 13) {
        return getRandomDialogue('university_failure');
    }
    
    // Ngã cầu thường
    if (currentGrade <= 4) return getRandomDialogue('early_failure');
    if (currentGrade >= 5 && currentGrade <= 8) return getRandomDialogue('middle_failure');
    if (currentGrade >= 9 && currentGrade <= 12) return getRandomDialogue('high_failure');
    
    return getRandomDialogue('early_failure'); // Default
}

// =================================================================
// EXPORT (nếu dùng module)
// =================================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GameDialogues,
        getRandomDialogue,
        getSuccessDialogue,
        getFailureDialogue
    };
}
