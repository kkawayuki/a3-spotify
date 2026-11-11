import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://127.0.0.1:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    //string concatenation with baseURL + endpoint
    var uri:string = this.expressBaseUrl + endpoint;

    //firstValueFrom generates a Promise for whatever is returned first from the GET request.
    //You shouldn't need to update this part.
    return firstValueFrom(this.http.get(uri)).then((response) => {
      return response;
    }, (err) => {
      return err;
    });
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    //TODO: identify the search endpoint in the express webserver (routes/index.js) and send the request to express.
    //Make sure you're encoding the resource with encodeURIComponent().
    //Depending on the category (artist, track, album), return an array of that type of data.
    //JavaScript's "map" function might be useful for this, but there are other ways of building the array.
    
    //build query
    var route:string = '/search/' + category + '/' + encodeURIComponent(resource);

    //send to express backend, receive and return response 
    return this.sendRequestToExpress(route).then((data) => {    
      switch(category)
      {
        case('artist'):
          return data['artists']['items'].map((item:any) => new ArtistData(item));
        case('track'):
          return data['tracks']['items'].map((item:any) => new TrackData(item));
        case('album'):
          return data['albums']['items'].map((item:any) => new AlbumData(item));
        default:
          return [];
      }
    });
  }

  getArtist(artistId:string):Promise<ArtistData> {
    //TODO: use the artist endpoint to make a request to express.
    //Again, you may need to encode the artistId.
    var route:string = '/artist/' + encodeURIComponent(artistId);
    return this.sendRequestToExpress(route).then((data) => { 
      return new ArtistData(data); 
    });
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //TODO: use the top tracks endpoint to make a request to express.
    var route:string = '/artist-top-tracks/' + encodeURIComponent(artistId);
    return this.sendRequestToExpress(route).then((data) => { 
      return data['tracks'].map((item:any) => new TrackData(item)); 
    });
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //TODO: use the albums for an artist endpoint to make a request to express.
    var route:string = '/artist-albums/' + encodeURIComponent(artistId);
    return this.sendRequestToExpress(route).then((data) => { 
      return data['items'].map((item:any) => new AlbumData(item)); 
    });
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    //TODO: use the album endpoint to make a request to express.
    var route:string = '/album/' + encodeURIComponent(albumId);
    return this.sendRequestToExpress(route).then((data) => { 
      return new AlbumData(data); 
    });
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    //TODO: use the tracks for album endpoint to make a request to express.
    var route:string = '/album-tracks/' + encodeURIComponent(albumId);
    return this.sendRequestToExpress(route).then((data) => { 
      return data['items'].map((item:any) => new TrackData(item)); 
    });
  }

  getTrack(trackId:string):Promise<TrackData> {
    //TODO: use the track endpoint to make a request to ex
    // press.
    var route:string = '/track/' + encodeURIComponent(trackId);
    return this.sendRequestToExpress(route).then((data) => { 
      return new TrackData(data); 
    });
  }
}