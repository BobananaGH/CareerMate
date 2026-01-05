const API_URL = "http://localhost:3000/api/analyze";

document.addEventListener("DOMContentLoaded", () => {
  const uploadBox = document.getElementById("uploadBox");
  const fileInput = document.getElementById("resumeFile");
  const uploadProgress = document.getElementById("uploadProgress");

  uploadBox.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", handleUpload);

  async function handleUpload() {
    const file = fileInput.files[0];
    if (!file) return;

    uploadProgress.style.display = "block";

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!data.success || !data.analysis) {
        throw new Error("AI không trả kết quả");
      }

      // ✅ LƯU KẾT QUẢ
      localStorage.setItem("cv_result", data.analysis);
      localStorage.setItem("cv_filename", file.name);

      // ✅ CHUYỂN SANG TRANG KẾT QUẢ
      window.location.href = "ketqua.html";

    } catch (err) {
      console.error(err);
      alert("Có lỗi khi phân tích CV");
    } finally {
      uploadProgress.style.display = "none";
    }
  }
});
