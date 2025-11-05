export const uploadAPI = {
  async getPresignURL(
    type: "resume" | "blog-image",
    filename: string,
    contentType: string
  ): Promise<{ uploadUrl: string; cdnUrl: string; key: string }> {
    const url = `/api/uploads/presign?type=${encodeURIComponent(
      type
    )}&filename=${encodeURIComponent(
      filename
    )}&contentType=${encodeURIComponent(contentType)}`;
    const res = await fetch(url, { method: "GET" });
    const json = await res.json();
    if (!res.ok || !json?.status)
      throw new Error(json?.error || "Presign failed");
    return json.data;
  },

  async putFileToS3(uploadUrl: string, file: File) {
    const res = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });
    if (!res.ok) throw new Error("S3 upload failed");
  },
};
