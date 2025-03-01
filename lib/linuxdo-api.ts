import axios from "axios";

export interface LinuxDoUserResponse {
  users: {
    id: number;
    username: string;
    name: string;
    avatar_template: string;
    flair_name: string;
    flair_url: string;
    flair_bg_color: string;
    flair_color: string;
    flair_group_id: number;
    trust_level: number;
    animated_avatar: string | null;
  }[];
}

export async function getUserInfo(username: string): Promise<{
  id: number;
  username: string;
  trust_level: number;
} | null> {
  try {
    const response = await axios.get<LinuxDoUserResponse>(
      `https://linux.do/u/${username}/summary.json`
    );

    if (response.data.users && response.data.users.length > 0) {
      const user = response.data.users[0];
      return {
        id: user.id,
        username: user.username,
        trust_level: user.trust_level,
      };
    }

    return null;
  } catch (error) {
    console.error(`获取用户 ${username} 信息失败:`, error);
    return null;
  }
}
