import { logo_verragio } from "./brandStore";

const DOMAIN = "verragio.com";

export const memberStore = {
  members: [
    {
      id: "u-admin",
      name: "Verragio",
      email: `admin@${DOMAIN}`,
      role: "Brand Admin",
      avatarType: "image",
      avatarUrl: logo_verragio,
      canEdit: true,
    },
    {
      id: "u-editor",
      name: "Eleanor Pena",
      email: `eleanor.p@${DOMAIN}`,
      role: "Visual Director",
      avatarType: "image",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop",
      canEdit: true,
    },
    {
      id: "u-viewer",
      name: "Ralph Edwards",
      email: `ralph.e@${DOMAIN}`,
      role: "Community Manager",
      avatarType: "image",
      avatarUrl:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&auto=format&fit=crop",
      canEdit: false, // Inbox only
    },
    {
      id: "u-guest",
      name: "Cody Fisher",
      email: `cody.f@${DOMAIN}`,
      role: "Event Coordinator",
      avatarType: "image",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
      canEdit: true,
    },
  ],
};

export const getMember = (id) => memberStore.members.find((m) => m.id === id);
