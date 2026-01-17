use tbp_project;

function map1(){
  if (!this.track_info || !this.track_info.track_genre) return;

  for (var i in this.track_info.track_genre) {
      emit(this.track_info.track_genre[i], 1);
    }
}

function reduce1(kljuc, vrijednosti){
  return Array.sum(vrijednosti);
}

db.spotify_songs.mapReduce(
  map1,
  reduce1,
  {
    out: "genre_song"
  }
)


function map2(){
  for (var i in this.track_info.track_genre) {
      emit(this.track_info.track_genre[i], 1);
    }
}

function reduce2(kljuc, vrijednosti){
  return Array.sum(vrijednosti)
}

db.spotify_songs.mapReduce(
  map2,
  reduce2,
  {
    out: "genre_songL",
    query: { "track_info.lyrics": { $exists: true, $type: "string" } }
  }
)


function map3() {
  var expli = this.track_info && this.track_info.explicit;
  var popu = this.track_info && this.track_info.popularity;

  emit(expli, { sum: popu, cnt: 1 });
}

function reduce3(kljuc, vrijednosti) {
  var r = { sum: 0, cnt: 0 };

  for (var i = 0; i < vrijednosti.length; i++) {
    r.sum += vrijednosti[i].sum;
    r.cnt += vrijednosti[i].cnt;
  }
  return r;
}

function finalize1(kljuc, r) {
  if (r.cnt == 0){
    return null;
  }
  return r.sum / r.cnt;
}

db.spotify_songs.mapReduce(
  map3,
  reduce3,
  {
    out: "avgPopu_explicit",
    finalize: finalize1
  }
)



function map4(){
  var d = this.audio_features.danceability;
  var l = this.audio_features.loudness;
  var t = this.audio_features.tempo;
  if (d == null || l == null || t == null) return;

  for (var i in this.track_info.track_genre) {
    emit(this.track_info.track_genre[i], {dance_sum: d, loud_sum: l, tempo_sum: t, cnt: 1 });
  }
}

function reduce4(key, values) {
  var r = { dance_sum: 0, loud_sum: 0, tempo_sum: 0, cnt: 0 };

  for (var i in values) {
    r.dance_sum += values[i].dance_sum;
    r.loud_sum += values[i].loud_sum;
    r.tempo_sum += values[i].tempo_sum;
    r.cnt += values[i].cnt;
  }
  return r;
}

function finalize2(key, r) {
  return {
    avg_danceability: r.dance_sum / r.cnt,
    avg_loudness: r.loud_sum / r.cnt,
    avg_tempo: r.tempo_sum / r.cnt
  };
}

db.spotify_songs.mapReduce(
  map4,
  reduce4,
  {
    out: "avgFeat_Genre",
    finalize: finalize2
  }
)



var stopWords = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"]

function map5() {

  var lyrics = this.track_info.lyrics;
  if (!lyrics) return;

  var words = lyrics.toLowerCase().split(" ");

  for (var i in words) {

    var w = words[i];
    if (!w) continue;
    if (w.length < 3) continue;

    if(stopWords.includes(w)) continue;
    
    emit(w, 1);
  }
}

function reduce5(kljuc, vrijednosti) {
    return Array.sum(vrijednosti)
}

db.spotify_songs.mapReduce(
    map5,
    reduce5,
    {
        out: "topWords",
        scope: {stopWords: stopWords}
    }
)


