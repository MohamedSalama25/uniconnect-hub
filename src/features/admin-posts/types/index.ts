export interface Post {
    id: string;
    title: string;
    author: string;
    date: string;
    status: "pending" | "completed" | "rejected";
    type: string;
}

export interface PostDetails extends Post {
    authorId: string;
    university: string;
    phone: string;
    email: string;
    description: string;
    images: string[];
}
