async function upvoteClickHandler(event) {  event.preventDefault();

    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length-1
    ];

    console.log('button clicked');
}

document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);