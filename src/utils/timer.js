function startMatchTimer(duration) {
    let timer = duration, minutes, seconds;
    let timerInterval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        console.log(timer)
        if (--timer < 0) {
            timer = duration;
            clearInterval(timerInterval);
        }
    }, 1000);
}

startMatchTimer(3000)