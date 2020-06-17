import React, { Component } from 'react';

export class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: this.props.data,
            divData: '',
            rowsLoaded: this.props.pageCount,
        }

        this.colState = [];
        this.b=true;
        this.loadMore = this.loadMore.bind(this);
        this.loadRows = this.loadRows.bind(this);
    }

    /**
    * Sorts a 2 dimensianal array.
    *
    * @param {array} The data array
    * @param {function} basicComparator The power, must be a natural number.
    * @param {boolean} if true, reversed order
    */
    sortArray = (a, colIndex) => {

        let toBeSorted = []

        // Create a new array with the visible rows
        for (let k = 0;k<this.state.rowsLoaded;k++){
            toBeSorted.push(a[k]);
        }

        // Remvove visible rows from original array
        for (let k = 0;k<this.state.rowsLoaded;k++){
          a.shift()
        }

        // sort the visible rows
        let c = toBeSorted.sort(compareNthElements(colIndex, basicComparator, this.b));

            // toggle true/false for reverse ordering
            this.b = !this.b

        // Join the visible(sorted) and non visible rows
        let sortedArray = toBeSorted.concat(a);

        // Once it's sorted, lets set the state
        this.setState({
            listData: sortedArray
        }, () => {
            this.loadRows();
        })

        function basicComparator(first, second) {
            if (first === second) {
                return 0;
            } else if (first < second) {
                return -1;
            } else {
                return 1;
            }
        }

        function compareNthElements(n, comparatorFunction, reverse) {
            return function (first, second) {
                if (reverse === true) {
                    return comparatorFunction(second[n], first[n]);
                } else {
                    return comparatorFunction(first[n], second[n]);
                }
            }
        }
    }

    /**
   * Loads more rows after the initial load
   *
   */
    loadMore() {

        // Just to makes variables more readable
        let allrows = this.state.listData.length;
        let loadedRows = this.state.rowsLoaded;
        let rowsToLoad = this.props.pageCount;

        // If there is still rows to load
        if (allrows > loadedRows) {
            this.setState({
                rowsLoaded: parseInt(this.state.rowsLoaded) + parseInt(rowsToLoad)
            }, () => {
                //console.log(this.state.rowsLoaded)
                this.loadRows()
            })
        }
    }

    /**
* Loads rows
*
*/
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
            borderBottom: this.props.headerBorderBottom,
            cursor: 'pointer'
        }

        try {
            // mapping header data
            let promise1 = this.props.headers.map(
                function (item, i) {
                    //console.log(that.props.data)
                    return <div style={headerStyle} onClick={() => { that.sortArray(that.state.listData, i) }} key={i}>{item}</div>
                }
            );
            // mapping table data
            let currentrow = 'odd';
            let row = 0;

            let promise2 = that.state.listData.map(
                function (item, i) {

                    if (i < that.state.rowsLoaded) {

                        // Check if even or odd row
                        if (i % 1 === 0) {
                            row++;
                            currentrow === 'even' ? currentrow = 'odd' : currentrow = 'even'
                        }

                        // Loop through each rows
                        return item.map((elem, index) => {
                            // Create zebra style
                            return currentrow === 'even' ?
                                <div row={row} style={cellStyleEven} key={'row' + i + '' + index} id={i + index}>{elem}</div> :
                                <div row={row} style={cellStyleOdd} key={'row' + i + '' + index} id={i + index}>{elem}</div>;
                        })
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

        //console.log(this.state.listData[1])
        let arr = [];
        let inarr = [];

        // Lets convert the array to a 2 dimensional array. Each sub-arrays will be same legtht as many columns
        this.props.data.map((item, i) => {
            inarr.push(item);
            if (i % this.props.cols === this.props.cols - 1) {
                arr.push(inarr)
                inarr = []
            }
        })

        // Lets fill the array with booleans. This will be used in the sortArray() method
        for(let i = 0;i<this.props.cols;i++){
        this.colState.push(false);
        }

        // Once it is multi dimensional, set state
        this.setState({
            listData: arr,
        }, () => {
            // If the actual rows in the array are less than the initial rows set in config
            if (this.state.listData.length < 10) {
                this.setState({
                    rowsLoaded: this.state.listData.length
                })
            }
            // Now let's load the rows
            this.loadRows()
        })

    }

    render() {

        // Main div style, the list will be in this
        const listDiv = {
            width: this.props.tableWidth + '%'
        }

        const loadMoreText = {
            cursor: 'pointer'
        }

        return (
            <>
                <div style={listDiv}>
                    {this.state.divData}

                    <div style={loadMoreText} onClick={this.loadMore}>Load {(this.state.listData.length) - this.state.rowsLoaded} more rows</div>
                </div>
            </>
        );
    }
}

export default List;