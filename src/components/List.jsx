import React, { Component } from 'react';

export class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [this.props.data],
            divData: '',
            rowsToLoad: this.props.pageCount * this.props.cols
        }
        this.loadMore = this.loadMore.bind(this);
    }

    // Load more rows when clicked
    loadMore() {
        // Just to makes variables more readable
        let allrows = this.props.data.length;
        let loadedRows = this.state.rowsToLoad;
        let rowsToLoad = this.props.pageCount;
        let cols = this.props.cols;

        // If there is still rows to load
        if (allrows > loadedRows) {
            this.setState({
                rowsToLoad: this.state.rowsToLoad + (cols * rowsToLoad)
            }, () => {
                this.loadRows()
            })
        }
    }

    // Load rows
    loadRows() {
        let that = this;
        // Style for individual cells
        const cellStyleEven = {
            textAlign: this.props.cellAlign,
            backgroundColor: this.props.rowColor,
            display: 'inline-block',
            width: 100 / this.props.cols + '%',
            paddingTop: this.props.cellpadding,
            paddingBottom: this.props.cellpadding,
        }

        const cellStyleOdd = {
            textAlign: this.props.cellAlign,
            backgroundColor: 'transparent',
            display: 'inline-block',
            width: 100 / this.props.cols + '%',
            paddingTop: this.props.cellpadding,
            paddingBottom: this.props.cellpadding,
        }

        const headerStyle = {
            textAlign: this.props.cellAlign,
            backgroundColor: this.props.headerRowColor,
            display: 'inline-block',
            width: 100 / this.props.cols + '%',
            paddingTop: this.props.cellpadding,
            paddingBottom: this.props.cellpadding,
            borderBottom: this.props.headerBorderBottom
        }

        try {
            // mapping header data
            let promise1 = this.props.headers.map(
                function (item, i) {
                    return <div style={headerStyle} key={i}>{item}</div>
                }
            );
            // mapping table data
            let currentrow = 'odd';

            let promise2 = this.props.data.map(
                function (item, i) {

                    if (i < that.state.rowsToLoad) {

                        // Check if even or odd row
                        if ((i + that.props.cols) % that.props.cols === 0) {
                            currentrow === 'even' ? currentrow = 'odd' : currentrow = 'even'
                        }

                        // Create zebra style
                        return currentrow === 'even' ?
                            <div style={cellStyleEven} key={i}>{item}</div> :
                            <div style={cellStyleOdd} key={i}>{item}</div>;
                    }
                }
            );

            // Now set datastate and render the list
            Promise.all([promise1, promise2]).then((data) => {
                this.setState({
                    divData: data,
                })
            });
        } catch (error) {
            alert(error)
        }
    }

    componentDidMount() {
        this.loadRows()
    }

    render() {

        // Main div style, the list will be in this
        const listDiv = {
            width: this.props.tableWidth + '%'
        }

        return (
            <>
                <div style={listDiv}>
                    {this.state.divData}
                    <div onClick={this.loadMore}>Load more</div>
                </div>
            </>
        );
    }
}

export default List;