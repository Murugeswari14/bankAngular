import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as d3 from 'd3';

@Component({
  selector: 'app-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.css']
})
export class ScatterComponent implements OnInit {
  
  private svg:any;
  private margin = 50;
  private width = 500 - (this.margin * 2);
  private height = 300 - (this.margin * 2);
  private createSvg(): void {
    this.svg = d3.select("figure#scatter")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
}
private drawPlot(data: any[]): void {
  // Add X axis
  const x = d3.scaleLinear()
  .domain(data.map(d => d.DepositAmt))
  .range([ 0, this.width ]);
  this.svg.append("g")
  .attr("transform", "translate(0," + this.height + ")")
  .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  // Add Y axis
  const y = d3.scaleLinear()
  .domain([0, 200000])
  .range([ this.height, 0]);
  this.svg.append("g")
  .call(d3.axisLeft(y));

  // Add dots
  const dots = this.svg.append('g');
  dots.selectAll("dot")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", (d: { Narration: d3.NumberValue; }) => x(d.Narration))
  .attr("cy", (d: { Withdrawal: d3.NumberValue; }) => y(d.Withdrawal))
  .attr("r", 7)
  .style("opacity", .5)
  .style("fill", "#69b3a2");

  // Add labels
  dots.selectAll("text")
  .data(data)
  .enter()
  .append("text")
  .text((d: { Framework: any; }) => d.Framework)
  .attr("x", (d: { Released: d3.NumberValue; }) => x(d.Released))
  .attr("y", (d: { Stars: d3.NumberValue; }) => y(d.Stars))
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
    (res) => this.drawPlot(res),
    (err) => console.log(err),

  );

}
}
