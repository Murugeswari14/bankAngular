import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as d3 from 'd3';
import { rgb } from 'd3';
 

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {
   
  private svg:any;
  private margin = 50;
  private width = 900 - (this.margin * 2);
  private height = 200 - (this.margin * 2);

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient) {
    
   }
  private createSvg(): void {
    this.svg = d3.select("figure#bar")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
}
private drawBars(data: any[]): void {
  // Create the X-axis band scale
  const x = d3.scaleBand()
  .range([0, this.width])
  .domain(data.map(d => d.Narration))
  .padding(0.5);

  // Draw the X-axis on the DOM
  this.svg.append("g")
  .attr("transform", "translate(0," + this.height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");

  // Create the Y-axis band scale
  const y = d3.scaleLinear()
  .domain([0, 250000])
  .range([this.height, 0]);

  // Draw the Y-axis on the DOM
  this.svg.append("g")
  .call(d3.axisLeft(y));

  // Create and fill the bars
  this.svg.selectAll("bars")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", (d: { Narration: string; }) => x(d.Narration))
  .attr("y", (d: { Withdrawal: d3.NumberValue; }) => y(d.Withdrawal))
  .attr("width", x.bandwidth())
  .attr("height", (d: { Withdrawal: d3.NumberValue; }) => this.height - y(d.Withdrawal))
  .attr("fill", "#d04a35");
}
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
    (res) => this.drawBars(res),
    (err) => console.log(err),

  );

}

}
