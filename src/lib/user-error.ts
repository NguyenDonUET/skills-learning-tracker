type ErrorKey =
  | "load"
  | "saveSession"
  | "updateSession"
  | "deleteSession"
  | "saveSkill"
  | "updateSkill"
  | "deleteSkill";

const COPY: Record<"en" | "vi", Record<ErrorKey, string>> = {
  en: {
    load: "Couldn't load your data. Check your connection and try again.",
    saveSession: "Couldn't save your session. Check your connection.",
    updateSession: "Couldn't update your session. Check your connection.",
    deleteSession: "Couldn't delete that session. Check your connection.",
    saveSkill: "Couldn't save that skill. Check your connection.",
    updateSkill: "Couldn't update that skill. Check your connection.",
    deleteSkill: "Couldn't delete that skill. Check your connection.",
  },
  vi: {
    load: "Không tải được dữ liệu. Kiểm tra kết nối và thử lại.",
    saveSession: "Không lưu được buổi luyện. Kiểm tra kết nối.",
    updateSession: "Không cập nhật được buổi luyện. Kiểm tra kết nối.",
    deleteSession: "Không xóa được buổi luyện. Kiểm tra kết nối.",
    saveSkill: "Không lưu được kỹ năng. Kiểm tra kết nối.",
    updateSkill: "Không cập nhật được kỹ năng. Kiểm tra kết nối.",
    deleteSkill: "Không xóa được kỹ năng. Kiểm tra kết nối.",
  },
};

function locale(): "en" | "vi" {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang.startsWith("vi") ? "vi" : "en";
}

function isTechnical(error: unknown) {
  if (!(error instanceof Error) || !error.message) return true;
  if (error instanceof TypeError) return true;
  return /failed to fetch|network|unauthorized|internal server error|request failed/i.test(
    error.message,
  );
}

export function userErrorMessage(error: unknown, key: ErrorKey) {
  if (!isTechnical(error) && error instanceof Error) return error.message;
  return COPY[locale()][key];
}
