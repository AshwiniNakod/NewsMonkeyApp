import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";
import { API, key } from './key';

export default class News extends Component {
  static defaultProps={
    country:'in',
    pageSize:8,
    category:'general'
  }

  static Propstype={
    country: PropTypes.string,
    pageSize:PropTypes.number,
    category:PropTypes.string
  }

  constructor(props) {
    super(props);
    // console.log("Hello I am in constructor from News component");
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults:0
    }
    document.title=`${this.capatalize(this.props.category)}-NewMonkey`;
  }

   capatalize=(string)=>{
    return string.charAt(0).toUpperCase()+string.slice(1)
  }

  async updateNews(){
    // console.log("cdm")
    let url = `${API}?country=${this.props.country}&category=${this.props.category}&apiKey=${key}&page=${this.state.page}&pageSize=${this.props.pageSize} `;
    let data = await fetch(url)
    // console.log(data)
    let parseData = await data.json()
    // console.log(parseData);
    this.setState({ articles: parseData.articles, 
                    totalResults: parseData.totalResults,
                    loading:false })

  }
  async componentDidMount() {
    // console.log("cdm")
    // const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=c2eaab54dbb543759b14cd1ecd1fcee8&page=1&pageSize=${this.props.pageSize} `;
    // let data = await fetch(url)
    // console.log(data)
    // let parseData = await data.json()
    // console.log(parseData);
    // this.setState({ articles: parseData.articles, 
    //                 totalResults: parseData.totalResults,
    //                 loading:false })

    this.updateNews();
  }

  handlePrevClick = async () => {
    this.setState({page:this.state.page - 1})
    this.updateNews()
  }
  handleNextClick = async () => {
    this.setState({page:this.state.page + 1})
    this.updateNews()
  }

  fetchMoreData= async()=>{
    this.setState({page:this.state.page+1})
    // console.log("cdm")
    let url = `${API}?country=${this.props.country}&category=${this.props.category}&apiKey=${key}&page=${this.state.page}&pageSize=${this.props.pageSize} `;
    let data = await fetch(url)
    // console.log(data)
    let parseData = await data.json()
    // console.log(parseData);
    this.setState({ 
                    articles : this.state.articles.concat(parseData.articles), 
                    totalResults : parseData.totalResults,
                     })

  }


  render() {
    return (

      <div className="container my-3">
        <h1 className="text-center" style={{margin:'35px'}}>NewsMonkey-Top {this.capatalize(this.props.category)} Headlines</h1>
          <InfiniteScroll style={{overflow:"no"}}
            dataLength={this.state.articles.length}
            next={this.fetchMoreData}
            hasMore={this.state.articles.length!==this.state.totalResults}
            loader={<Spinner/>}
          >
        {/* {this.state.loading && <Spinner />} */}
        <div className="container">
        <div className="row">
          {this.state.articles.map((element) => {
            return <div className="col-md-4" key={element.url}>
              <NewsItem title={element.title ? element.title.slice(0, 45) : ""} description={element.description ? element.description.slice(0, 88) : ""}
                imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
            </div>
          })}
          </div>
        </div>
        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between">
          <button type="button" disabled={this.state.page <= 1} className="btn btn-dark" onClick={this.handlePrevClick}>&larr;Previous</button>
          <button type="button" disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} className="btn btn-dark" onClick={this.handleNextClick}>Next&rarr;</button>

        </div> */}
      </div>

    )
  }
}
