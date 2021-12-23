import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup } from '@angular/forms';
import * as d3 from 'd3';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})
export class PieComponent implements OnInit {
 
  private svg:any;
  private margin = 50;
  private width = 300;
  private height = 500;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors:any;
   
  private createSvg(): void {
    this.svg = d3.select("figure#pie")
    .append("svg")
    .attr("width", this.width)
    .attr("height", this.height)
    .append("g")
    .attr(
      "transform",
      "translate(" + this.width / 2 + "," + this.height / 2 + ")"
    );
}
private createColors(data: any[]): void {
  this.colors = d3.scaleOrdinal()
  .domain(data.map((d: { Withdrawal: { toString: () => any; }; }) => d.Withdrawal.toString()))
  .range(["#c7d3ec", "#a5b8db", "#879cc4", "#677795", "#5a6782"]);
}
private drawChart(data: any[]): void {
  // Compute the position of each group on the pie:
  const pie = d3.pie<any>().value((d: any) => Number(d.Withdrawal));

  // Build the pie chart
  this.svg
  .selectAll('pieces')
  .data(pie(data))
  .enter()
  .append('path')
  .attr('d', d3.arc()
    .innerRadius(0)
    .outerRadius(this.radius)
  )
  //.attr('fill', (d: any, i: any) => (this.colors(i)))
  //.attr("stroke", "#FFFFFF")
  //.style("stroke-width", "1px");

  // Add labels
  const labelLocation = d3.arc()
  .innerRadius(100)
  .outerRadius(this.radius);

  this.svg
  .selectAll('pieces')
  .data(pie(data))
  .enter()
  .append('text')
  //.text((d: { data: { Narration: any; }; }) => d.data.Narration)
  .attr("transform", (d: d3.DefaultArcObject) => "translate(" + labelLocation.centroid(d) + ")")
  .style("text-anchor", "middle")
  .style("font-size", 15);
}
  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient) { }

  SERVER_URL = "http://127.0.0.1:5000/file-upload";
  uploadForm: FormGroup | any; 

  ngOnInit(): void {

    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });

    this.createSvg();
    // d3.csv("/assets/frameworks.csv").then(data => this.drawBars(data));

}
onFileSelect(event: Event) {

  if ((<HTMLInputElement>event.target).files?.length! > 0) {
    const file = (<HTMLInputElement>event.target).files![0];
    console.log("file in onselectfile is : " + file)
    this.uploadForm.get('profile').setValue(file);
  }

}

onSubmit() {
  const formDatas = new FormData();

  
  formDatas.append('file', this.uploadForm.get('profile').value);
  console.log("File in onsubmit is :" +this.uploadForm.get('profile').value)


  for (var key in this.uploadForm) {
    console.log(key, this.uploadForm[key]);
    formDatas.append(key, this.uploadForm[key]);
  }
  this.httpClient.post<any>(this.SERVER_URL, formDatas).subscribe(
    (res) => this.drawChart(res),
    (err) => console.log(err),

  );

}

}