const photo1 = "/mock/verragio/brand/campaigns/1/product.jpg";
const photo2 = "/mock/verragio/brand/campaigns/2/product.jpg";

export const emailData = {
  folders: [
    { id: "inbox", label: "Inbox", icon: "inbox", count: 4 },
    { id: "starred", label: "Starred", icon: "star", count: 0 },
    { id: "snoozed", label: "Snoozed", icon: "clock", count: 0 },
    { id: "sent", label: "Sent", icon: "send", count: 0 },
    { id: "trash", label: "Trash", icon: "trash", count: 0 },
  ],
  emails: [
    {
      id: 1,
      sender: {
        name: "Allan Wang",
        email: "maria23luch45@gmail.com",
        avatar:
          "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      },
      subject: "Request for Invoice",
      preview:
        "Dear Team, I hope this message finds you well. I wanted to take a moment...",
      body: `Dear Team,

I hope this message finds you well.

I wanted to take a moment to express my appreciation for the excellent service I received during my last purchase. Could you please send me the invoice for that purchase at your earliest convenience? I would greatly appreciate it.
Thank you for your assistance!

Best regards,
Allan Wang`,
      timestamp: "4:01 PM",
      isRead: false,
      isStarred: false,
      date: "Oct 23",
    },
    {
      id: 2,
      sender: {
        name: "Jaxson Korsgaard",
        email: "jaxson@example.com",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      },
      subject: "Unveiling the Latest Trends",
      preview:
        "Hello, I trust you are having a great day. We are excited to announce...",
      body: "Full content of the email...",
      timestamp: "4:01 PM",
      isRead: true,
      isStarred: false,
      date: "Oct 22",
    },
    {
      id: 3,
      sender: {
        name: "Ruben Torff",
        email: "ruben@example.com",
        avatar:
          "https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      },
      subject: "Join Us for a VIP Preview Event",
      preview:
        "Hi, I hope you're enjoying a productive week. We would be honored to...",
      body: "Full content of the email...",
      timestamp: "4:01 PM",
      isRead: true,
      isStarred: true,
      date: "Oct 21",
    },
    {
      id: 4,
      sender: {
        name: "Leo Passaquindici Arcand",
        email: "leo@example.com",
        avatar:
          "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      },
      subject: "Luxury Redefined: Limited Edition Release",
      preview:
        "Greetings, I hope all is well with you. Introducing our newest collection...",
      body: "Full content of the email...",
      timestamp: "4:01 PM",
      isRead: true,
      isStarred: false,
      date: "Oct 20",
    },
    {
      id: 5,
      sender: {
        name: "Anika Herwitz",
        email: "anika@example.com",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      },
      subject: "Elevate Your Style: Personal Styling Session",
      preview:
        "Dear, I hope you're doing wonderfully. We have a special offer for...",
      body: "Full content of the email...",
      timestamp: "4:01 PM",
      isRead: true,
      isStarred: false,
      date: "Oct 19",
    },
  ],
};

export const smsData = {
  conversations: [
    {
      id: 1,
      contact: {
        name: "Allan Wang",
        phone: "+1 (888) 907-4404",
        avatar:
          "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      },
      lastMessage: "Hey, I hope this message finds you well.",
      timestamp: "4:01 PM",
      unreadCount: 0,
      messages: [
        {
          id: 1,
          sender: "them",
          text: "Hey, I hope this message finds you well. I've forgotten the name of the watch I looked at today. Could you please send me more detailed information?",
          timestamp: "10:20 AM",
        },
        {
          id: 2,
          sender: "me",
          text: "I hope you're doing well too!\nThe watch you inquired about is the Rolex Sea-Dweller 40. I'd be happy to provide you with more detailed information. Please let me know what specific details you're interested in, and I'll get back to you promptly.",
          timestamp: "10:22 AM",
          image:
            "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        },
      ],
    },
    {
      id: 2,
      contact: {
        name: "Mira Herwitz",
        phone: "+1 (555) 123-4567",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      },
      lastMessage: "Discover Our Luxury Collection",
      timestamp: "4:01 PM",
      unreadCount: 1,
      messages: [],
    },
    {
      id: 3,
      contact: {
        name: "Justin Carder",
        phone: "+1 (555) 987-6543",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      },
      lastMessage: "Unveiling the Latest Trends",
      timestamp: "4:01 PM",
      unreadCount: 0,
      messages: [],
    },
  ],
};

export const socialData = {
  platforms: [
    { id: "all", label: "All", icon: "x" }, // Using 'x' as placeholder or we filter in UI
    { id: "instagram", label: "Instagram", count: 5, icon: "instagram" },
    { id: "facebook", label: "Facebook", count: 0, icon: "facebook" },
    { id: "google", label: "Google Business", count: 0, icon: "google" },
  ],
  items: [
    {
      id: 1,
      platform: "instagram",
      type: "comment",
      user: {
        name: "Allan Wang",
        avatar:
          "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      },
      content: "Absolutely stunning! 😍",
      timestamp: "4:01 PM",
      post: {
        imageUrl: photo1,
        caption:
          "The new @Rolex Land-Dweller 40 in a white Rolesor version, combining Oystersteel and white gold...",
        likes: "868,570",
      },
      isRead: false,
    },
    {
      id: 2,
      platform: "instagram",
      type: "comment",
      user: {
        name: "Erin Press",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      },
      content: "Love this piece! 🔥",
      timestamp: "4:01 PM",
      isRead: false,
      post: { imageUrl: photo2 },
    },
    {
      id: 3,
      platform: "instagram",
      type: "comment",
      user: {
        name: "Phillip Siphron",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      },
      content: "Timeless elegance! 🕴️",
      timestamp: "4:01 PM",
      isRead: false,
      post: { imageUrl: photo1 },
    },
    {
      id: 4,
      platform: "facebook", // Validating filter logic
      type: "comment",
      user: {
        name: "Dulce Rosser",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      },
      content: "Such a classic! ❤",
      timestamp: "4:01 PM",
      isRead: false,
      post: { imageUrl: photo1 },
    },
  ],
};
