const Instagram = require('instagram-web-api')
//const { username, password } = process.env
// const username = "impuntuals2.0";
// const password = "impuntuals1234";

// const client = new Instagram({ username, password })
 
// ;(async () => {
//     await client.login()
//     // const profile = await client.getProfile()
//     // console.log(profile)

//     const me = await client.getUserByUsername({ username: username });

//     var basic_info = {
//         id:  me.id,
//         followed_by: me.edge_followed_by.count,
//         follow: me.edge_follow.count,
//         total_posts: me.edge_owner_to_timeline_media.count,
//     }

    // get_media_info().then(function(result){
    //     console.log(result);
    // });

    // get_suspicious_info("shambhalacaravana").then(function(result){
    //     console.log(result);
    // });

    // get_mutuals_info(basic_info.id, basic_info.followed_by, basic_info.follow).then(function(result){
    //     console.log(result);
    // });

// })()


async function get_media_info(username,password,totalmedia){

    const client = new Instagram({ username, password })
    await client.login()

    const me = await client.getUserByUsername({ username: username });

    var basic_info = {
        id:  me.id,
        followed_by: me.edge_followed_by.count,
        follow: me.edge_follow.count,
    }

    if(totalmedia == undefined || totalmedia > me.edge_owner_to_timeline_media.count){
        basic_info.total_posts =  me.edge_owner_to_timeline_media.count;
    }
    else{
        basic_info.total_posts = totalmedia;
    }

    var photos = [];
    var end_cursor = '';
    for(var i = 0; i < basic_info.total_posts; i+=50){
        let obj = await client.getPhotosByUsername({ username: username , first: basic_info.total_posts, after: end_cursor});
        end_cursor = obj.user.edge_owner_to_timeline_media.page_info.end_cursor;
        photos = photos.concat(obj.user.edge_owner_to_timeline_media.edges);
    }

    // const photos = await client.getPhotosByUsername({ username: username , first: 50})
    ///when I have the total likes, I can calculate the average likes per photo

    var total_videos = 0;
    var total_photos = 0;

    var total_likes = 0;
    var total_comments = 0;

    var total_photo_likes = 0;
    var total_video_likes = 0;

    var total_photo_comments = 0;
    var total_video_comments = 0;

    var total_video_views = 0;
    
    photos.forEach(function(item,index){
        total_likes += (item.node.edge_media_preview_like.count);
        total_comments += (item.node.edge_media_to_comment.count);
        if (item.node.is_video){
            total_videos++;
            total_video_views += item.node.video_view_count;
            total_video_likes += (item.node.edge_media_preview_like.count);
            total_video_comments += (item.node.edge_media_to_comment.count);
        }
        else{
            total_photos++;
            total_photo_likes += (item.node.edge_media_preview_like.count);
            total_photo_comments += (item.node.edge_media_to_comment.count);
        }
    });

    var obj = {
        posts: basic_info.total_posts,
        total_photos: total_photos,
        total_videos: total_videos,
        total_likes: total_likes,
        total_comments: total_comments,
        total_photo_likes: total_photo_likes,
        total_video_likes: total_video_likes,
        total_video_views: total_video_views,
        average_likes_per_post: (total_likes / basic_info.total_posts),
        average_likes_per_photo: (total_photo_likes / total_photos),
        average_likes_per_video: (total_video_likes / total_videos),
        average_comments_per_post: (total_comments / basic_info.total_posts),
        average_comments_per_photo: (total_photo_comments / total_photos),
        average_comments_per_video: (total_video_comments / total_videos),
        average_views_per_video: (total_video_views / total_videos),
    }

    return obj;

}


async function get_suspicious_info(username, password, suspicious_user){
     ////HAS SOMEONE BLOCKED YOU??///
     const client = new Instagram({ username, password })
    //write the username that you are looking for
    // var suspicious_user = "shambhalacaravana";
    await client.login()

    const suspicious = await client.getUserByUsername({ username: suspicious_user });

    var obj = {
        you_follow_user: (suspicious.followed_by_viewer),
        user_follows_you: (suspicious.follows_viewer),
        has_you_blocked : (suspicious.has_blocked_viewer),
    }

    return obj;

    ///I could actually add a feature that lets you see someone's total likes, average likes, ... just changing the username of you for him
}


async function get_mutuals_info(username, password){

    const client = new Instagram({ username, password })
    await client.login()

    const me = await client.getUserByUsername({ username: username });

    var basic_info = {
        id:  me.id,
        followed_by: me.edge_followed_by.count,
        follow: me.edge_follow.count,
        total_posts: me.edge_owner_to_timeline_media.count,
    }
    ////GETTING MUTUALS + verified functionality///////// 

    var followers = [];
    var end_cursor1 = '';
    for(var i = 0; i < basic_info.followed_by; i+=50){
        let obj = await client.getFollowers({ userId: basic_info.id , first: basic_info.followed_by, after: end_cursor1});
        end_cursor1 = obj.page_info.end_cursor;
        followers = followers.concat(obj.data);
    }

    var followings = [];
    var end_cursor2 = '';
    for(var j = 0; j < basic_info.follow; j+=50){
        let obj = await client.getFollowings({ userId: basic_info.id , first: basic_info.follow, after: end_cursor2});
        end_cursor2 = obj.page_info.end_cursor;
        followings = followings.concat(obj.data);
    }
    // const followers = await client.getFollowers({ userId: basic_info.id , first: basic_info.followed_by, after:''})
    // const followings = await client.getFollowings({ userId: basic_info.id , first: basic_info.follow})

    const followers_username = [];
    const followings_username = [];
    var verifieds_following_you = [];
    followers.forEach(function(item, index){
        followers_username.push(item.username);
        if (item.is_verified){
            verifieds_following_you.push(item.username);
        }
    })
    followings.forEach(function(item, index){
        followings_username.push(item.username);
    })

    const mutuals = followers_username.filter(value => followings_username.includes(value));
    //could parse the usernames from the mutuals array to make it more efficient

    ////NON MUTUALS: WHO DO YOU NOT FOLLOW BACK? WHO DOES NOT FOLLOW YOU BACK?/////////
    const you_dont_follow_them = followers_username.filter(value => !followings_username.includes(value));

    const they_dont_follow_you = followings_username.filter(value => !followers_username.includes(value));

    // const you_dont_follow_back = [];
    // const they_dont_follow_you = [];
    // var count = 0;
    // for(var i = 0; i<non_mutuals.length;i++){
    //     var user = non_mutuals[i];
    //     if (followers_username.includes(user)) count++; //you_dont_follow_back.push(user)
    //     else if (followings_username.includes(user)) console.log(user, "does not follow you") //they_dont_follow_you.push(user);
    // }
    // console.log(count)

    var obj = {
        mutuals: {
            total_mutuals: mutuals.length,
            following_each_other: mutuals,
        },
        non_mutuals: {
            total_non_mutuals: (they_dont_follow_you.length + you_dont_follow_them.length),
            total_they_dont_follow_you: they_dont_follow_you.length,
            they_dont_follow_you: they_dont_follow_you,
            total_you_dont_follow_back: you_dont_follow_them.length,
            you_dont_follow_back: you_dont_follow_them,
        },
        verifieds: {
            total_verifieds_following_you: verifieds_following_you.length,
            verifieds_following_you: verifieds_following_you,
        }
    }

    return obj;
}

module.exports.get_media_info = get_media_info;
module.exports.get_suspicious_info = get_suspicious_info;
module.exports.get_mutuals_info = get_mutuals_info;
