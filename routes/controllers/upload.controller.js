// 브라우저가 Vercel Blob 으로 직접 업로드한다 (서버리스 요청 본문 4.5MB 제한 회피).
// 이 라우트는 업로드용 단기 토큰만 발급하며, 호출 전에 requireAuth 로 인증된다.
exports.handle = async (req, res, next) => {
  try {
    const { handleUpload } = await import('@vercel/blob/client');
    const json = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        maximumSizeInBytes: 10 * 1024 * 1024,
        addRandomSuffix: true,
        tokenPayload: JSON.stringify({ email: req.user.email })
      })
    });
    res.json(json);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
