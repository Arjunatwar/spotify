let music = {
    musicList: [
        {
            name: "Chale aana",
            img: "https://m.media-amazon.com/images/M/MV5BNGNjZmI5ZjAtMTZmOS00MGYyLTg1OGMtNTk0NDAwNjU1ZjhiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            audio: "./music/Chale Aana.m4a"
        },
        {
            name: "Samjho na",
            img: "https://i1.sndcdn.com/artworks-ZH687m8uec7cmntp-yDvr7w-t1080x1080.jpg",
            audio: "./music/Samjho Na.m4a"
        },
        {
            name: "Closer",
            img: "https://m.media-amazon.com/images/M/MV5BOTZlYTZlNWItOGI2OS00YmU0LWFkOTgtNjRjZDI3MjNkMzdmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            audio: "./music/Closer.m4a"
        },
        {
            name: "APT",
            img: "https://c.saavncdn.com/138/APT-English-2024-20241126043245-500x500.jpg",
            audio: "./music/APT.m4a"
        },
        {
            name: "Aaj sajeya",
            img: "https://s.saregama.tech/image/c/fw_485/4/98/9a/aaj-sajeya-chill-flip-ap-1440_1685092202.jpg",
            audio: "./music/Aaj Sajeya.m4a"
        },
        {
            name: "Aaj din chadeya",
            img: "https://c.saavncdn.com/871/Aaj-Din-Chadheya-From-Love-Aaj-Kal-Club-Mix-Hindi-2022-20230430081844-500x500.jpg",
            audio: "./music/Ajj Din Chadheya.m4a"
        }
    ],
    currentIndex: 0,
    isPlaying: false,
    audio: new Audio()
};

const musicList = document.querySelector('.music ul');
const controllerImage = document.querySelector('.controller img');
const progressBar = document.querySelector('.progress-bar');
const currentTimeSpan = document.querySelector('.current-time');
const durationSpan = document.querySelector('.duration');
const playPauseBtn = document.querySelector('.fa-circle-pause');
const prevBtn = document.querySelector('.fa-backward');
const nextBtn = document.querySelector('.fa-forward');

function initPlayer() {
    const currentSong = music.musicList[music.currentIndex];
    music.audio.src = currentSong.audio;
    controllerImage.src = currentSong.img;
    
    controllerImage.style.animationPlayState = 'paused';
    music.isPlaying = false;
    playPauseBtn.classList.replace('fa-circle-pause', 'fa-circle-play');
    
    music.audio.load();
    
    document.querySelector('.controller').setAttribute('data-playing', currentSong.name);
}

async function togglePlay() {
    try {
        if (music.isPlaying) {
            await music.audio.pause();
            playPauseBtn.classList.replace('fa-circle-pause', 'fa-circle-play');
            controllerImage.style.animationPlayState = 'paused';
        } else {
            const playPromise = music.audio.play();
            if (playPromise !== undefined) {
                await playPromise;
                playPauseBtn.classList.replace('fa-circle-play', 'fa-circle-pause');
                controllerImage.style.animationPlayState = 'running';
            }
        }
        music.isPlaying = !music.isPlaying;
    } catch (error) {
        console.error('Playback error:', error);
        alert('Error playing audio. Please check if the audio file exists.');
    }
}

function updateProgress() {
    const { currentTime, duration } = music.audio;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.value = progressPercent;
    
    currentTimeSpan.textContent = formatTime(currentTime);
    durationSpan.textContent = formatTime(duration);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function changeSong(direction) {
    music.isPlaying = false; 
    music.currentIndex = (music.currentIndex + direction + music.musicList.length) % music.musicList.length;
    initPlayer();
    togglePlay(); 
}

progressBar.addEventListener('input', (e) => {
    const seekTime = (e.target.value / 100) * music.audio.duration;
    music.audio.currentTime = seekTime;
});
playPauseBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeSong(-1));
nextBtn.addEventListener('click', () => changeSong(1));

progressBar.addEventListener('click', (e) => {
    const clickPosition = e.offsetX / progressBar.offsetWidth;
    music.audio.currentTime = clickPosition * music.audio.duration;
});

music.audio.addEventListener('timeupdate', updateProgress);

musicList.addEventListener('click', async (e) => {
    const clickedLi = e.target.closest('li');
    if (clickedLi) {
        const index = Array.from(musicList.children).indexOf(clickedLi);
        if (index !== -1) {
            music.currentIndex = index;
            initPlayer();
            await togglePlay();
        }
    }
});

music.audio.addEventListener('ended', () => {
    changeSong(1); 
});

function initPlayer() {
    const currentSong = music.musicList[music.currentIndex];
    music.audio.src = currentSong.audio;
    controllerImage.src = currentSong.img;
    
    controllerImage.style.animationPlayState = 'paused';
    music.isPlaying = false;
    playPauseBtn.classList.replace('fa-circle-pause', 'fa-circle-play');
    
    music.audio.load();
    
    document.querySelector('.controller').setAttribute('data-playing', currentSong.name);
}

music.audio.addEventListener('error', (e) => {
    console.error('Error loading audio:', e);
    alert('Error playing this track. Please try another song.');
});

initPlayer();