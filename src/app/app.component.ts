import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from './services/data.service';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],// import HttpClientModule
  providers: [DataService],   //Add service in your component providers list
  templateUrl: './app.component.html',
})
export class AppComponent  {
  title="COURSE REGISTRATION"
 

}
