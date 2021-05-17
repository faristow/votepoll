import { Injectable } from '@angular/core';
import { Vote } from '../vote/vote.model';
import { Subject } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  private votes : Vote [] = []
  // to avoid manipulating the copies of votes in a array.
  private votesUpdated = new Subject<Vote[]>();

  constructor(private http : HttpClient) { }

  getVotes() {
    this.http.get<{message: string, votes: any}>("http://localhost:3000/api/vote"
    )
    .pipe(map((voteData) =>{
      return voteData.votes.map(vote =>{
        return {
          title : vote.title,
          content : vote.content,
          id : vote._id,
          imagePath : vote.imagePath
        }
      })
    }))
    .subscribe((transformedVotes) =>{
      this.votes = transformedVotes
      this.votesUpdated.next([...this.votes])
    })
  }
  // we can't directly use the voteupdated, so using observable
  getVoteUpdateListener(){
    return this.votesUpdated.asObservable();
  }

  //getting Vote by ID
  getVoteById(id : string){
    console.log(id)
    return this.http.get<{_id: string, title:string, content: string, imagePath : string, voteCount : number}>(
      "http://localhost:3000/api/vote/" + id)
      // .subscribe(data =>{
      //   console.log(data)
      //   return data;
      // })

  }
  getUserById(id : string){
    console.log(id)
    return this.http.get(
      `http://localhost:3000/api/user/${id}`)

      // .subscribe(data =>{
      //   console.log(data)
      //   return data;
      // })

  }

  addVote(title : string, content : string , image: File, voteCount: number){
    const voteData = new FormData();
    voteData.append("title", title);
    voteData.append("content", content);
    voteData.append("image",image, title)

    this.http.post<{message : string, vote: Vote}>("http://localhost:3000/api/vote", voteData)
    .subscribe((responseData) =>{
      const vote : Vote = {
        id: responseData.vote.id,
        title : title,
        content : content,
        voteCount : voteCount,
        imagePath : responseData.vote.imagePath
      }
      this.votes.push(vote);
      this.votesUpdated.next([...this.votes]);
    })

  }

  updateVote(id: string, title: string, content: string, image: File | string, voteCount : number){
    let voteData : Vote| FormData
    if(typeof(image)==='object'){
      voteData = new FormData();
      voteData.append("id", id)
      voteData.append("title", title);
      voteData.append("content", content);
      voteData.append("image", image , title)
    }else{
       voteData  ={
        id: id,
        title : title,
        content : content,
        imagePath : image,
        voteCount : voteCount,
      }
    }
    this.http.put("http://localhost:3000/api/vote/" + id, voteData)
    .subscribe(response => {
      const updatedPosts = [...this.votes];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
      const vote : Vote ={
        id: id,
        title : title,
        content : content,
        imagePath : "",
        voteCount : voteCount
      }
      updatedPosts[oldPostIndex] = vote;
      this.votes = updatedPosts;
      this.votesUpdated.next([...this.votes])
    });
  }
  updateVoted(id: string){

    return this.http.put( `http://localhost:3000/api/vote/updateVote/${id}`,{} )
    .pipe(map((res) => res as any));
  }

  deleteVote(voteId : string){
    this.http.delete("http://localhost:3000/api/vote/" + voteId)
    .subscribe(() =>{
      const updatedVotes = this.votes.filter(vote => vote.id !== voteId)
      this.votes = updatedVotes;
      this.votesUpdated.next([...this.votes])
    })
  }
}
