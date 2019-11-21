$( document ).ready( onReady );

function onReady(){
    $( '#addTrackButton' ).on( 'click', addTrack );
    $( '#tracksOut' ).on( 'click', '.up', upSongRank );
    $( '#tracksOut' ).on( 'click', '.down', downSongRank );
    $( '#tracksOut' ).on( 'click', '.delete', deleteSong );
    getSongs();
}

function addTrack(){
    console.log( 'in addTrack' );
    // get user input 
    // put into an object
    let objectToSend = {
        rank: $( '#rankIn' ).val(),
        artist: $( '#artistIn' ).val(),
        track: $( '#trackIn' ).val(),
        published: $( '#publishedIn' ).val()
    }
    console.log( 'sending:', objectToSend );
    //send to server via AJAX
    $.ajax({
        type: 'POST',
        url: '/songs',
        data: objectToSend
    }).then( function( response ){
        console.log( 'back from POST with:', response );
        // update DOM
        getSongs();
    }).catch( function( err ){
        // handle error
        alert( 'error adding track. see console for details' );
        console.log( err );
    }) // end AJAX
} // end addTrack

function getSongs(){
    // AJAX GET call
    $.ajax({
        type: 'GET',
        url: '/songs'
    }).then( function( response ){
        // empty output element
        let el = $( '#tracksOut' );
        el.empty(); 
        // loop through responses
        for( let i=0; i< response.length; i++ ){
            let song = response[ i ];
            // append to DOM
            let li = $(`<li>
                        ${ song.rank }: ${ song.track } by ${ song.artist }
                        <button class="up">Up Rank</button> 
                        <button class="down">Down Rank</button>
                        <button class="delete">Delete</button> 
                    </li>`) ;
            li.data('id', song.id);
            el.append(li);
        } //end for
    }).catch( function( err ){
        // handle errors
        alert( 'error getting songs. see console for details' );
        console.log( err );
    })
};

// DELETE FUNCTION
function deleteSong() {
    console.log('Deleting Song');
    
    let id = $(this).closest('li').data('id');
    $.ajax({
        method: 'DELETE',
        url: `/songs/${id}`
    }).then( function(response) {
        getSongs(); // refresh page
    }).catch( function(err){
        alert( 'error deleting song.')
        console.log('deleting a song');
    })
}

function upSongRank() {
    console.log('moving song up');
    let id = $(this).closest('li').data('id');
    changeSongRank('up', id);
}

function downSongRank() {
    console.log('moving song down');
    let id = $(this).closest('li').data('id');
    changeSongRank('down', id);

}

function changeSongRank(direction, id){
    
    $.ajax({
        method: 'PUT',
        url: `/songs/${id}`,
        data: {
        direction: direction
        }
    }).then( function(response){
        getSongs();
    }).catch( function (err){
        alert( 'alert alert') 
    })
};