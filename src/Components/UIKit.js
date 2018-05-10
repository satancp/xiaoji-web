const pngBase = name => `https://xiaoji-web.oss-cn-hangzhou.aliyuncs.com/web/${name}.png`;

export const Image = {
    BannerBG: pngBase('banner_image'),
    Logo: pngBase('logo'),
    More: pngBase('more_image@2x'),
    ProfileMorningBG: pngBase('profile_bg_morning'),
    ProfileNoonBG: pngBase('profile_bg_noon'),
    ProfileAfternoonBG: pngBase('profile_bg_afternoon'),
    ProfileEveningBG: pngBase('profile_bg_evening'),
    ProfileNightBG: pngBase('profile_bg_night')
};
