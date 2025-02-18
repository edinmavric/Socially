"use client";

import {
  getProfileByUsername,
  getUserPosts,
  updateProfile,
} from "@/actions/profile.action";
import { getFollowers, toggleFollow } from "@/actions/user.action";

import PostCard from "@/components/post-card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { SignInButton, useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import {
  CalendarIcon,
  EditIcon,
  FileTextIcon,
  HeartIcon,
  LinkIcon,
  MapPinIcon,
  Lock,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

type User = Awaited<ReturnType<typeof getProfileByUsername>>;
type Posts = Awaited<ReturnType<typeof getUserPosts>>;
type Users = Awaited<ReturnType<typeof getFollowers>>;

interface ProfilePageClientProps {
  user: NonNullable<User>;
  posts: Posts;
  likedPosts: Posts;
  isFollowing: boolean;
  followers: Users;
  followings: Users;
}

const ProfilePageClient = ({
  isFollowing: initialIsFollowing,
  likedPosts,
  posts,
  user,
  followers,
  followings,
}: ProfilePageClientProps) => {
  const { user: currentUser } = useUser();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showFollowersDialog, setShowFollowersDialog] = useState(false);
  const [showFollowingDialog, setShowFollowingDialog] = useState(false);

  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const [editForm, setEditForm] = useState({
    name: user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
    privacy: user.privacy,
  });

  const handleEditSubmit = async () => {
    const formData = new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await updateProfile(formData);
    if (result.success) {
      setShowEditDialog(false);
      toast.success("Profile updated successfully");
    }
  };

  const handleFollow = async () => {
    if (!currentUser) return;

    try {
      setIsUpdatingFollow(true);
      await toggleFollow(user.id);
      setIsFollowing(!isFollowing);
    } catch (error) {
      toast.error("Failed to update follow status");
    } finally {
      setIsUpdatingFollow(false);
    }
  };
  const isOwnProfile =
    currentUser?.username === user.username ||
    currentUser?.emailAddresses[0].emailAddress.split("@")[0] === user.username;
  const canSee = (user.privacy ? isFollowing : true) || isOwnProfile;
  const formattedDate = format(new Date(user.createdAt), "MMMM yyyy");
  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 gap-6">
        <div className="w-full max-w-lg mx-auto">
          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.image ?? "/avatar.png"} />
                </Avatar>
                <h1 className="mt-4 text-2xl font-bold">
                  {user.name ?? user.username}
                </h1>
                <p className="text-muted-foreground">@{user.username}</p>
                <p className="mt-2 text-sm">{user.bio}</p>

                {/* PROFILE STATS */}
                <div className="w-full mt-6">
                  <div className="flex justify-between mb-4">
                    <div
                      className={`${
                        canSee
                          ? "cursor-pointer"
                          : "cursor-default pointer-events-none"
                      }`}
                      onClick={() => {
                        if (canSee) setShowFollowingDialog((prev) => !prev);
                      }}
                    >
                      <div className="font-semibold">
                        {user._count.following.toLocaleString()}
                      </div>
                      <div
                        className="text-sm text-muted-foreground 
"
                      >
                        Following
                      </div>
                    </div>
                    <Separator orientation="vertical" />
                    <div
                      className={`${
                        canSee
                          ? "cursor-pointer"
                          : "cursor-default pointer-events-none"
                      }`}
                      onClick={() => {
                        if (canSee) setShowFollowersDialog((prev) => !prev);
                      }}
                    >
                      <div className="font-semibold">
                        {user._count.followers.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Followers
                      </div>
                    </div>
                    <Separator orientation="vertical" />
                    <div
                      className={`${
                        canSee
                          ? "cursor-pointer"
                          : "cursor-default pointer-events-none"
                      }`}
                      onClick={() => {
                        if (canSee) setActiveTab("posts");
                      }}
                    >
                      <div className="font-semibold">
                        {user._count.posts.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Posts</div>
                    </div>
                  </div>
                </div>

                {/* "FOLLOW & EDIT PROFILE" BUTTONS */}
                {!currentUser ? (
                  <SignInButton mode="modal">
                    <Button className="w-full mt-4">Follow</Button>
                  </SignInButton>
                ) : isOwnProfile ? (
                  <Button
                    className="w-full mt-4"
                    onClick={() => setShowEditDialog(true)}
                  >
                    <EditIcon className="size-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    className="w-full mt-4"
                    onClick={handleFollow}
                    disabled={isUpdatingFollow}
                    variant={isFollowing ? "outline" : "default"}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}

                {/* LOCATION & WEBSITE */}
                <div className="w-full mt-6 space-y-2 text-sm">
                  {user.location && (
                    <div className="flex items-center text-muted-foreground">
                      <MapPinIcon className="size-4 mr-2" />
                      {user.location}
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center text-muted-foreground">
                      <LinkIcon className="size-4 mr-2" />
                      <a
                        href={
                          user.website.startsWith("http")
                            ? user.website
                            : `https://${user.website}`
                        }
                        className="hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {user.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center text-muted-foreground">
                    <CalendarIcon className="size-4 mr-2" />
                    Joined {formattedDate}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {canSee ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="posts"
                className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary
               data-[state=active]:bg-transparent px-6 font-semibold"
              >
                <FileTextIcon className="size-4" />
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="likes"
                className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary
               data-[state=active]:bg-transparent px-6 font-semibold"
              >
                <HeartIcon className="size-4" />
                Likes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-6">
              <div className="space-y-6">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard key={post.id} post={post} dbUserId={user.id} />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No posts yet
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="likes" className="mt-6">
              <div className="space-y-6">
                {likedPosts.length > 0 ? (
                  likedPosts.map((post) => (
                    <PostCard key={post.id} post={post} dbUserId={user.id} />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No liked posts to show
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent"></TabsList>

            <div className="space-y-6">
              <div className="py-8 text-muted-foreground">
                <div className="flex justify-center items-center space-x-4">
                  <Lock className="size-10" />
                  <div>
                    <p className="text-white font-semibold">
                      This account is private
                    </p>
                    <p>Follow to see their posts and likes.</p>
                  </div>
                </div>
              </div>
            </div>
          </Tabs>
        )}

        <Dialog
          open={showFollowersDialog}
          onOpenChange={setShowFollowersDialog}
        >
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Followers</DialogTitle>
            </DialogHeader>
            <Card>
              <CardContent>
                <div className="space-y-4">
                  {followers.map((user) => (
                    <div
                      key={user.id}
                      className="flex gap-2 items-center justify-between "
                    >
                      <div className="flex items-center gap-1">
                        <Link href={`/profile/${user.username}`}>
                          <Avatar>
                            <AvatarImage src={user.image ?? "/avatar.png"} />
                          </Avatar>
                        </Link>
                        <div className="text-xs">
                          <Link
                            href={`/profile/${user.username}`}
                            className="font-medium cursor-pointer"
                          >
                            {user.name}
                          </Link>
                          <p className="text-muted-foreground">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
        <Dialog
          open={showFollowingDialog}
          onOpenChange={setShowFollowingDialog}
        >
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Following</DialogTitle>
            </DialogHeader>
            <Card>
              <CardContent>
                <div className="space-y-4">
                  {followings.map((user) => (
                    <div
                      key={user.id}
                      className="flex gap-2 items-center justify-between "
                    >
                      <div className="flex items-center gap-1">
                        <Link href={`/profile/${user.username}`}>
                          <Avatar>
                            <AvatarImage src={user.image ?? "/avatar.png"} />
                          </Avatar>
                        </Link>
                        <div className="text-xs">
                          <Link
                            href={`/profile/${user.username}`}
                            className="font-medium cursor-pointer"
                          >
                            {user.name}
                          </Link>
                          <p className="text-muted-foreground">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  name="name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  className="min-h-[100px]"
                  placeholder="Tell us about yourself"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  name="location"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                  placeholder="Where are you based?"
                />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input
                  name="website"
                  value={editForm.website}
                  onChange={(e) =>
                    setEditForm({ ...editForm, website: e.target.value })
                  }
                  placeholder="Your personal website"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="privacy">Public account</Label>
                  <Switch
                    id="privacy"
                    value={`${editForm.privacy}`}
                    checked={!editForm.privacy}
                    onClick={() => {
                      setEditForm((prevForm) => ({
                        ...prevForm,
                        privacy: !prevForm.privacy,
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleEditSubmit}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
export default ProfilePageClient;
